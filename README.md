# Portfolio Profissional - Guia Completo

## 📝 Descrição do Projeto

Este é um site portfolio moderno e responsivo, desenvolvido com HTML, TailwindCSS e JavaScript puro. O site é 100% compatível com hospedagem estática no Netlify e possui suporte a múltiplos idiomas (Português, Inglês e Espanhol).

### ✨ Características Principais

- 🌐 **Multi-idioma**: Português (BR), Inglês (EN) e Espanhol (ES)
- 🌙 **Modo escuro/claro**: Alternância automática de temas
- 📱 **100% Responsivo**: Funciona perfeitamente em mobile, tablet e desktop
- 🚀 **Carregamento rápido**: Otimizado para performance
- 🎬 **Seção de vídeos**: Suporte a YouTube, Google Drive e outras plataformas
- 💼 **Portfólio de projetos**: Links diretos para seus trabalhos
- 🎨 **Design moderno**: Interface limpa e profissional

---

## 🚀 Como Fazer Deploy no Netlify

### Opção 1: Upload Manual (Recomendado)

1. **Baixe todos os arquivos do projeto:**
   - `index.html`
   - `scripts/main.js`
   - `scripts/animations.js`
   - `scripts/translations.js`
   - `styles/custom.css`

2. **Acesse o Netlify:**
   - Vá para [netlify.com](https://netlify.com)
   - Faça login ou crie uma conta gratuita

3. **Faça o deploy:**
   - Na página inicial, procure por "Deploy manually"
   - Arraste a pasta com todos os arquivos para a área de upload
   - Aguarde o processamento (1-2 minutos)
   - Seu site estará online com uma URL tipo: `https://nome-aleatorio.netlify.app`

4. **Personalize o domínio (opcional):**
   - Vá em "Site settings" > "Domain management"
   - Clique em "Change site name"
   - Escolha um nome personalizado: `https://seu-nome.netlify.app`

### Opção 2: Deploy via Git (Avançado)

1. Suba os arquivos para um repositório GitHub
2. No Netlify, clique em "New site from Git"
3. Conecte seu repositório GitHub
4. Configure o build (deixe vazio para sites estáticos)
5. Clique em "Deploy site"

---

## ✏️ Como Editar o Conteúdo

### 1. Editando Informações Pessoais

**Arquivo: `scripts/translations.js`**

Procure por estas chaves e altere os textos:

```javascript
// Informações principais
hero_name: "Seu Nome Aqui",
hero_role: "Sua Profissão",
hero_description: "Sua descrição pessoal",

// Sobre você
intro_title: "Título da seção",
intro_description: "Sua apresentação detalhada",
```

⚠️ **Importante**: Edite o texto nas 3 linguagens (pt, en, es) para manter a consistência.

### 2. Adicionando/Editando Projetos Web

**Arquivo: `scripts/main.js`**

Encontre a seção `projectData` e edite:

```javascript
const projectData = {
    project1: {
        title: "Nome do Projeto",
        description: "Descrição do projeto",
        url: "https://seusite.com/projeto", // ← ALTERE AQUI
        technologies: ["React", "Node.js", "MongoDB"],
        image: "https://link-da-imagem.jpg"
    }
    // Para adicionar novo projeto, copie o bloco acima
};
```

**Para adicionar novo projeto:**
1. Copie um projeto existente
2. Renomeie para `project4`, `project5`, etc.
3. Altere todos os dados
4. Adicione as traduções no `translations.js`

### 3. Gerenciando Vídeos

**Arquivo: `scripts/main.js`**

Encontre a seção `videoData`:

```javascript
const videoData = {
    reels: [
        { 
            id: 'reel1', 
            title: 'reel1_title', 
            desc: 'reel1_desc', 
            url: 'dQw4w9WgXcQ', // ← ID do YouTube ou link
            aspect: '9:16' // ← 16:9 para horizontal, 9:16 para vertical
        }
    ]
};
```

#### Como adicionar vídeos de diferentes plataformas:

**YouTube:**
- Use apenas o ID do vídeo
- Exemplo: `https://youtube.com/watch?v=dQw4w9WgXcQ` → use `dQw4w9WgXcQ`

**Google Drive:**
- Compartilhe o vídeo como "Qualquer pessoa com o link pode visualizar"
- Copie o ID do link compartilhado
- Exemplo: `https://drive.google.com/file/d/1ABC-123-XYZ/view` → use `1ABC-123-XYZ`

**Outros serviços:**
- Use o link de embed completo fornecido pela plataforma

#### Adicionando nova categoria de vídeo:

1. **No `main.js`**, adicione na seção `videoData`:
```javascript
nova_categoria: [
    { id: 'novo1', title: 'novo1_title', desc: 'novo1_desc', url: 'ID_VIDEO', aspect: '16:9' }
]
```

2. **No `index.html`**, adicione o botão da categoria:
```html
<button class="video-tab" data-category="nova_categoria" data-translate="tab_nova_categoria">
    Nova Categoria
</button>
```

3. **No `translations.js`**, adicione as traduções:
```javascript
tab_nova_categoria: "Nova Categoria",
novo1_title: "Título do Vídeo",
novo1_desc: "Descrição do vídeo",
```

### 4. Editando Habilidades

**Arquivo: `scripts/translations.js`**

Procure pela seção de skills:

```javascript
// Skills
skill1_name: "Nome da Habilidade",
skill1_desc: "Descrição da habilidade",
skill1_percentage: "90", // Porcentagem de 0 a 100
```

### 5. Adicionando/Editando Depoimentos

**Arquivo: `scripts/translations.js`**

Encontre a seção de testimonials:

```javascript
testimonial1_name: "Nome do Cliente",
testimonial1_role: "Cargo, Empresa",
testimonial1_text: "Texto do depoimento...",
```

---

## 🎨 Personalizando o Design

### Alterando Cores

**Arquivo: `styles/custom.css`**

```css
:root {
    --primary: #3B82F6; /* Cor principal */
    --primary-dark: #2563EB; /* Cor principal escura */
}
```

### Alterando Fontes

**Arquivo: `index.html`**

Procure por esta linha e altere a fonte:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

---

## 📱 Garantindo Responsividade dos Vídeos

### Formatos Suportados

- **Horizontal (16:9)**: Para vídeos de landscape, tutorials, VSLs
- **Vertical (9:16)**: Para reels, stories, vídeos mobile

### Configuração no Código

```javascript
// Para vídeo horizontal
{ aspect: '16:9' }

// Para vídeo vertical  
{ aspect: '9:16' }
```

O sistema automaticamente aplica o CSS correto para manter a proporção em todos os dispositivos.

---

## 🌐 Gerenciando Traduções

### Estrutura das Traduções

Cada texto possui uma chave única que deve existir nas 3 linguagens:

```javascript
const translations = {
    pt: { // Português
        hero_name: "João Silva"
    },
    en: { // Inglês
        hero_name: "John Silva"
    },
    es: { // Espanhol
        hero_name: "Juan Silva"
    }
};
```

### Adicionando Nova Tradução

1. Escolha uma chave única (ex: `novo_texto`)
2. Adicione nas 3 seções de idioma
3. Use no HTML: `data-translate="novo_texto"`

---

## 🔧 Solução de Problemas Comuns

### Vídeo não carrega
- ✅ Verifique se o ID do YouTube está correto
- ✅ Confirme se o vídeo está público
- ✅ Para Google Drive, verifique as permissões de compartilhamento

### Tradução não funciona
- ✅ Verifique se a chave existe nas 3 linguagens
- ✅ Confirme se o atributo `data-translate` está correto no HTML

### Layout quebra no mobile
- ✅ Use `aspect: '9:16'` para vídeos verticais
- ✅ Teste sempre em diferentes tamanhos de tela

### Site não carrega no Netlify
- ✅ Certifique-se que o arquivo `index.html` está na raiz
- ✅ Verifique se todos os caminhos dos arquivos estão corretos
- ✅ Confirme que não há erros no console do navegador

---

## 📞 Suporte

Este README contém todas as informações necessárias para personalizar seu portfolio. O código foi desenvolvido para ser fácil de editar, mesmo sem conhecimento técnico avançado.

### Estrutura de Arquivos
```
portfolio/
├── index.html (página principal)
├── scripts/
│   ├── main.js (lógica principal)
│   ├── animations.js (animações)
│   └── translations.js (traduções)
└── styles/
    └── custom.css (estilos personalizados)
```

### Checklist de Deploy
- [ ] Editei minhas informações pessoais
- [ ] Atualizei os links dos projetos
- [ ] Configurei os vídeos corretamente
- [ ] Testei as traduções
- [ ] Verifiquei a responsividade
- [ ] Fiz upload para o Netlify

---

**🎉 Parabéns! Seu portfolio está pronto para impressionar!**