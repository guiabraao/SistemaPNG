# Pelada Nova Geração

Aplicação React + Vite da PNG. Todas as 23 rotas existentes continuam disponíveis.

## Desenvolvimento

Na pasta `Front`, execute `npm install` e `npm run dev`.

Validação: `npm run lint` e `npm run build`.

## Interface

A interface prioriza celulares a partir de 320px. Os tokens de cor, espaçamento,
raio e tipografia estão em `src/index.css`; os layouts compartilhados estão em
`src/styles/Pages.module.css`. Início, Explorar, Artilharia e Eventos possuem
composições próprias, integradas às mesmas rotas e ao mesmo cabeçalho.

GSAP anima entrada de páginas e troca de temporada com transform/opacity,
contextos limpos ao sair da página e respeito a `prefers-reduced-motion`.
Não há animações contínuas nem ScrollTriggers desnecessários.

## Temporadas das estatísticas

`src/data/seasons.js` centraliza as fontes. 2026 é selecionado por padrão nas duas seções e usa
a fonte existente, cuja última atualização verificada é de agosto de 2026.
O arquivo remoto não contém partidas ou posições em campo; esses valores não
são inventados pela interface.

Os rankings de 2025 utilizam as últimas revisões publicadas em novembro de 2025
no histórico Git das fontes originais, fixadas por commit em `src/data/seasons.js`.
Em 2026, a artilharia permanece ligada ao arquivo remoto; as assistências
usam o arquivo local fornecido pelo usuário. O controle exibe exatamente 2025 e
2026; novas temporadas podem ser acrescentadas à configuração no futuro.
A fonte de assistências de 2025 usa `assist`, enquanto a de 2026 usa
`assistencias`. `statisticValue` normaliza os dois formatos na apresentação.

O ranking é ordenado sem modificar os dados recebidos. Empates compartilham
posição. Fotos são associadas às URLs dos cards já existentes; nomes ambíguos
não recebem a foto de outro jogador. Imagens indisponíveis exibem iniciais sem
substituir as URLs originais. As imagens locais foram preservadas.

## Dados e eventos

`useRemote` carrega as fontes de cada temporada, cancela solicitações ao sair da página,
reaproveita dados em memória, atualiza a fonte novamente ao reentrar e oferece
estados de carregamento, erro e tentativa novamente.

Eventos continuam usando a chave `eventos` no localStorage e os campos
`name`, `date` e `details`. A leitura acontece antes da primeira gravação.
A página mantém o aviso de uso pela diretoria; o projeto original não possui
autenticação ou sincronização dos eventos entre dispositivos.

## Verificação do redesign

Build e lint aprovados. Verificadas as 23 rotas em 320, 360, 375, 390, 412, 430,
768, 1024 e 1280px (207 verificações de overflow). Também foram verificados:
temporada padrão, alternância 2025 → 2026 → 2025 em gols e assistências,
alternância rápida durante a transição,
busca, movimento reduzido, criação/edição/exclusão de eventos e persistência
após recarregar. Nenhum erro JavaScript durante o teste no Edge.
