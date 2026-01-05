import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ChevronUp, ChevronDown, Edit, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

export function AxisManagement() {
  const { data: axes } = trpc.sliders.listAxes.useQuery();
  const utils = trpc.useUtils();

  const [editingAxis, setEditingAxis] = useState<number | null>(null);
  const [deletingAxis, setDeletingAxis] = useState<number | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Form state for editing/creating
  const [formData, setFormData] = useState({
    leftLabel: "",
    rightLabel: "",
    description: "",
  });

  // Mutations
  const updateAxisMutation = trpc.sliders.updateAxis.useMutation({
    onSuccess: () => {
      utils.sliders.listAxes.invalidate();
      utils.sliders.getLatestStates.invalidate();
      setEditingAxis(null);
      toast.success("Axis updated");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteAxisMutation = trpc.sliders.deleteAxis.useMutation({
    onSuccess: () => {
      utils.sliders.listAxes.invalidate();
      utils.sliders.getLatestStates.invalidate();
      setDeletingAxis(null);
      toast.success("Axis deleted");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const createAxisMutation = trpc.sliders.createAxis.useMutation({
    onSuccess: () => {
      utils.sliders.listAxes.invalidate();
      setShowCreateDialog(false);
      setFormData({ leftLabel: "", rightLabel: "", description: "" });
      toast.success("Axis created");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const reorderAxisMutation = trpc.sliders.updateAxis.useMutation({
    onSuccess: () => {
      utils.sliders.listAxes.invalidate();
    },
  });

  const handleEdit = (axis: any) => {
    setEditingAxis(axis.id);
    setFormData({
      leftLabel: axis.leftLabel,
      rightLabel: axis.rightLabel,
      description: axis.description || "",
    });
  };

  const handleSaveEdit = () => {
    if (!editingAxis) return;
    updateAxisMutation.mutate({
      axisId: editingAxis,
      ...formData,
    });
  };

  const handleDelete = (axisId: number) => {
    setDeletingAxis(axisId);
  };

  const confirmDelete = () => {
    if (!deletingAxis) return;
    deleteAxisMutation.mutate({ axisId: deletingAxis });
  };

  const handleCreate = () => {
    if (!formData.leftLabel || !formData.rightLabel) {
      toast.error("Please provide both axis labels");
      return;
    }
    createAxisMutation.mutate({
      leftLabel: formData.leftLabel,
      rightLabel: formData.rightLabel,
      description: formData.description,
    });
  };

  const handleReorder = (axisId: number, direction: "up" | "down") => {
    // Note: Reordering requires backend support for displayOrder field
    // For now, just show a toast
    toast.info("Reordering feature coming soon");
  };

  const deletingAxisData = axes?.find(a => a.id === deletingAxis);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Emotional Axes</CardTitle>
        <CardDescription>
          Customize your bipolar emotional dimensions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Axes List */}
        {axes?.map((axis, index) => (
          <div key={axis.id} className="flex items-center gap-2 p-4 border rounded-lg">
            <div className="flex flex-col gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleReorder(axis.id, "up")}
                disabled={index === 0}
                className="h-6 w-6 p-0"
              >
                <ChevronUp className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleReorder(axis.id, "down")}
                disabled={index === axes.length - 1}
                className="h-6 w-6 p-0"
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1">
              <div className="font-medium">
                {axis.leftLabel} ↔ {axis.rightLabel}
              </div>
              {axis.description && (
                <div className="text-sm text-muted-foreground">{axis.description}</div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(axis)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(axis.id)}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}

        {/* Create Button */}
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="w-full"
          variant="outline"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Custom Axis
        </Button>

        {/* Edit Dialog */}
        <Dialog open={editingAxis !== null} onOpenChange={() => setEditingAxis(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Axis</DialogTitle>
              <DialogDescription>
                Modify the labels and description for this emotional dimension
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="leftLabel">Left Label</Label>
                <Input
                  id="leftLabel"
                  value={formData.leftLabel}
                  onChange={(e) => setFormData(prev => ({ ...prev, leftLabel: e.target.value }))}
                  placeholder="e.g., Anxiety"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rightLabel">Right Label</Label>
                <Input
                  id="rightLabel"
                  value={formData.rightLabel}
                  onChange={(e) => setFormData(prev => ({ ...prev, rightLabel: e.target.value }))}
                  placeholder="e.g., Calm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="What does this axis measure?"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingAxis(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} disabled={updateAxisMutation.isPending}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Custom Axis</DialogTitle>
              <DialogDescription>
                Define a new bipolar emotional dimension
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="newLeftLabel">Left Label</Label>
                <Input
                  id="newLeftLabel"
                  value={formData.leftLabel}
                  onChange={(e) => setFormData(prev => ({ ...prev, leftLabel: e.target.value }))}
                  placeholder="e.g., Scattered"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newRightLabel">Right Label</Label>
                <Input
                  id="newRightLabel"
                  value={formData.rightLabel}
                  onChange={(e) => setFormData(prev => ({ ...prev, rightLabel: e.target.value }))}
                  placeholder="e.g., Focused"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newDescription">Description (Optional)</Label>
                <Textarea
                  id="newDescription"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="What does this axis measure?"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={createAxisMutation.isPending}>
                Create Axis
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={deletingAxis !== null} onOpenChange={() => setDeletingAxis(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Axis?</AlertDialogTitle>
              <AlertDialogDescription>
                {deletingAxisData && (
                  <>
                    You are about to delete <strong>{deletingAxisData.leftLabel} ↔ {deletingAxisData.rightLabel}</strong>.
                    <br /><br />
                    <span className="text-destructive font-medium">
                      ⚠️ Warning: This will permanently delete all historical calibration data for this axis.
                    </span>
                    <br /><br />
                    This action cannot be undone.
                  </>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
                Delete Permanently
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
