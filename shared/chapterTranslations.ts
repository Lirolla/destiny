// Portuguese translations for chapter titles
// Maps English chapter titles to Portuguese equivalents

export const chapterTitlesPt: Record<number, string> = {
  1: "O Dom Divino: O Poder Incrível e a Responsabilidade Aterrorizante do Livre Arbítrio",
  2: "A Lei Inquebrantável da Sua Realidade",
  3: "A Vantagem Injusta: Como Encontrar Significado num Mundo de Injustiça",
  4: "A Gravidade da Escolha: Navegando os Papéis de Agressor e Vítima",
  5: "A Encruzilhada da Escolha: O Custo Terrível da Indecisão",
  6: "O Momento Fénix: Renascendo das Cinzas do Seu Passado",
  7: "Marco Aurélio e o Caminho Estoico para a Liberdade Interior",
  8: "O Peso da Sua Vontade: O Poder Radical de Assumir Responsabilidade",
  9: "A Alquimia da Vontade: Transformando Sofrimento em Força",
  10: "O Surfista e a Onda: A Dança do Livre Arbítrio e das Leis Universais",
  11: "O Paradoxo da Oração: Pedir Ajuda Enfraquece o Livre Arbítrio?",
  12: "O Mito do Génio Solitário: Porque a Sua Vontade Precisa de uma Tribo",
  13: "O Arquiteto do Destino: Como as Suas Escolhas Diárias Constroem a Sua Vida",
  14: "O Seu Momento Invictus: O Capitão da Sua Alma",
};

export function getChapterTitle(chapterNumber: number, language: "en" | "pt" | "es", englishTitle: string): string {
  if (language === "pt") {
    return chapterTitlesPt[chapterNumber] || englishTitle;
  }
  // Spanish and English both fall back to English titles
  return englishTitle;
}
