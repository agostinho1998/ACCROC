# Site da ACCROC

Site da **ACCR do Outeiro da Cortiçada, IPSS**: Associação Centro de Convívio e Recreio do Outeiro da Cortiçada.

É um site simples (HTML, CSS e um pouco de JavaScript), sem base de dados, alojado gratuitamente no **GitHub Pages**.

## Páginas

| Endereço | Ficheiro | Conteúdo |
|---|---|---|
| `/` | `index.html` | Início: próximos eventos, o que fazemos, notícias e donativos |
| `/associacao/` | `associacao/index.html` | Quem somos, percurso, missão/visão/valores, órgãos sociais, donativos |
| `/a-nossa-terra/` | `a-nossa-terra/index.html` | História da vila, pontos de interesse, como chegar |
| `/centro-de-dia/` | `centro-de-dia/index.html` | Separadores: O Centro de Dia · Documentação · Parcerias |
| `/contactos/` | `contactos/index.html` | Associação (sede) e Centro de Dia, formulário |

Atalhos úteis: `/centro-de-dia/#documentacao` abre logo os relatórios e contas, e `/associacao/#apoiar` abre os donativos.

## Pastas

```
assets/css/site.css      estilos comuns (cabeçalho, menu, telemóvel)
assets/js/site.js        menu, separadores, eventos, notícias, formulário
assets/img/              fotos e brasão (nomes fixos)
data/noticias.json       últimas notícias (geradas a partir do Facebook)
data/eventos.json        próximos eventos (gerados a partir do Facebook)
scripts/facebook.mjs     programa que vai buscar os posts ao Facebook
.github/workflows/       tarefa automática que corre o programa a cada 3 horas
```

## Como mudar uma foto

As fotos têm **nomes fixos**. Para trocar uma, envia-se uma nova com **o mesmo nome** para `assets/img/` (no GitHub: abrir a pasta → *Add file* → *Upload files*).

| Ficheiro | Onde aparece |
|---|---|
| `assets/img/brasao.png` | Brasão no cabeçalho (falta a versão em boa resolução) |
| `assets/img/Centro_dia_frente.jpg` | Fundo do topo das páginas (falta a versão em boa resolução) |

Os quadrados azul-claros com texto entre [parênteses retos] são lugares para fotos e textos ainda por pôr.

## Notícias e eventos (a partir do Facebook)

A associação publica só no Facebook (https://www.facebook.com/accrouteirodacorticadaipss) e o site atualiza-se sozinho.

- **Notícias:** os 3 últimos posts aparecem na página inicial.
- **Eventos:** os posts com cartaz e `#evento` aparecem no cartão "Próximos eventos". Saem sozinhos quando a data passa.

Regra para um evento aparecer no site:

```
Festas da Aldeia 2027          ← 1.ª linha: nome do evento
Data: 20/06/2027               ← obrigatório (dia/mês/ano)
Local: Largo da aldeia         ← opcional
Venham todos! #evento          ← obrigatório: #evento
```
(e o **cartaz** como foto do post)

### Ligar ao Facebook (feito uma vez, por um administrador da página)

1. Criar uma app gratuita em https://developers.facebook.com e gerar uma **chave de página** (*Page access token*) com a permissão `pages_read_engagement`. Uma chave de página obtida a partir de uma chave de utilizador de longa duração não expira.
2. No GitHub: **Settings → Secrets and variables → Actions → New repository secret**, e criar:
   - `FB_PAGE_ID`: o ID numérico da página de Facebook
   - `FB_PAGE_TOKEN`: a chave de página
3. Em **Actions → "Atualizar do Facebook" → Run workflow**, correr a primeira vez à mão.

Sem estes dois segredos a tarefa não faz nada, e o site continua a mostrar os exemplos.

## Publicar (GitHub Pages)

**Settings → Pages → Build and deployment → Source: "Deploy from a branch" → Branch: `main` / `(root)` → Save.**

Ao fim de 1 a 2 minutos, o site fica em `https://agostinho1998.github.io/ACCROC/`.

### Domínio próprio (mais tarde)

Quando o `accroc.eu.org` for aprovado (ou se se comprar um `.pt`):
1. **Settings → Pages → Custom domain** → escrever o domínio → Save.
2. No DNS do domínio, criar um registo `CNAME` de `www` para `agostinho1998.github.io`. Para o domínio sem `www`, criar os registos `A` indicados na documentação do GitHub Pages.
3. Ativar **Enforce HTTPS**.

## Por fazer

- [ ] Fotos e brasão em boa resolução
- [ ] Textos entre [parênteses retos]: utentes, inscrição, descrições dos pontos de interesse, órgãos sociais
- [ ] Relatórios e contas 2023–2025
- [ ] Copiar os PDF dos relatórios do Wix para o site (`docs/`), para não dependerem do Wix
- [ ] Ligar ao Facebook (secção acima)
- [ ] Confirmar o IBAN com a tesouraria
