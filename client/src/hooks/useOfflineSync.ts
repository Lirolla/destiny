import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import {
  queueAction,
  getQueuedActions,
  removeQueuedAction,
  updateRetryCount,
  getQueueSize,
  type QueuedAction,
} from "@/lib/offlineQueue";
import { toast } from "sonner";

const MAX_RETRIES = 3;

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queueSize, setQueueSize] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  const utils = trpc.useUtils();

  // Update online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Connection restored");
      syncQueue();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.warning("You're offline. Changes will be saved locally.");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Update queue size periodically
  useEffect(() => {
    const updateSize = async () => {
      const size = await getQueueSize();
      setQueueSize(size);
    };

    updateSize();
    const interval = setInterval(updateSize, 5000);

    return () => clearInterval(interval);
  }, []);

  /**
   * Sync all queued actions to the server
   */
  const syncQueue = async () => {
    if (!isOnline || isSyncing) return;

    setIsSyncing(true);

    try {
      const actions = await getQueuedActions();
      
      if (actions.length === 0) {
        setIsSyncing(false);
        return;
      }

      console.log(`Syncing ${actions.length} queued actions...`);

      for (const action of actions) {
        try {
          await processAction(action);
          await removeQueuedAction(action.id!);
          console.log(`Synced action ${action.id}`);
        } catch (error: any) {
          console.error(`Failed to sync action ${action.id}:`, error);

          // Increment retry count
          const newRetryCount = action.retryCount + 1;

          if (newRetryCount >= MAX_RETRIES) {
            // Remove action after max retries
            await removeQueuedAction(action.id!);
            toast.error(`Failed to sync action after ${MAX_RETRIES} attempts`);
          } else {
            await updateRetryCount(action.id!, newRetryCount);
          }
        }
      }

      // Update queue size
      const newSize = await getQueueSize();
      setQueueSize(newSize);

      if (newSize === 0) {
        toast.success("All changes synced");
        
        // Invalidate queries to refresh data
        utils.sliders.invalidate();
        utils.dailyCycle.invalidate();
      }
    } catch (error) {
      console.error("Sync queue error:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  /**
   * Process a single queued action
   */
  const processAction = async (action: QueuedAction) => {
    switch (action.type) {
      case "slider_calibration":
        // Call the tRPC mutation directly
        await utils.client.sliders.recordState.mutate(action.payload);
        break;

      case "daily_cycle_update":
        // Call the appropriate daily cycle mutation
        if (action.payload.phase === "morning") {
          await utils.client.dailyCycle.startMorning.mutate(action.payload);
        } else if (action.payload.phase === "midday") {
          await utils.client.dailyCycle.completeMidday.mutate(action.payload);
        } else if (action.payload.phase === "evening") {
          await utils.client.dailyCycle.completeEvening.mutate(action.payload);
        }
        break;

      default:
        console.warn(`Unknown action type: ${action.type}`);
    }
  };

  /**
   * Queue an action for later sync
   */
  const queueForSync = async (
    type: QueuedAction["type"],
    payload: any
  ) => {
    await queueAction({
      type,
      payload,
      timestamp: Date.now(),
      retryCount: 0,
    });

    const newSize = await getQueueSize();
    setQueueSize(newSize);

    toast.info("Saved locally. Will sync when online.");
  };

  return {
    isOnline,
    queueSize,
    isSyncing,
    syncQueue,
    queueForSync,
  };
}
