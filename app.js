// Navegação entre sections
function navegarPara(paginaId) {
  // Oculta todas as paginas removendo a classe 'active'
  const paginas = document.querySelectorAll('.page');
  paginas.forEach(pagina => pagina.classList.remove('active'));

  // Remove a classe 'active' de todos os botões do menu
  const botoesNav = document.querySelectorAll('.nav-btn');
  botoesNav.forEach(botao => botao.classList.remove('active'));

  // Exibe a página selecionada
  const paginaAlvo = document.getElementById(paginaId);
  if (paginaAlvo) {
    paginaAlvo.classList.add('active');
  }

  // Destaca o botão correspondente no menu
  botoesNav.forEach(botao => {
    const attrOnclick = botao.getAttribute('onclick');
    if (attrOnclick && attrOnclick.includes(paginaId)) {
      botao.classList.add('active');
    }
  });
}

const loja = {
  id: "1",
  nome: "Padaria do Seu Zé",
  descricao: "A Melhor Padaria Da Cidade",
  url_img: "https://hqxvifficctpdmsxmaoc.supabase.co/storage/v1/object/public/teste/Paradaria%20do%20Seu%20Ze.avif",
  whatsapp: "77981011017"
};

let cartTeste = {
  total: 0
};

let carrinho = [];

let dadosCardapio = [];

//--------------- Função Traser id do Produto ---------------//
function addCarrinho(botao) {
  const card = botao.closest('.item-card');
  const dataId = card.dataset.id;
  const dataNome = card.dataset.nome;

  console.log('ID do produto:', dataId, dataNome);

  // Executa a função para adicionar ao carrinho antes de encerrar
  addProduto(dataId, dataNome);

  return dataId;
}

//--------------- Função Remover ou Diminuir do Carrinho ---------------//
function removeCarrinho(botao) {
  const card = botao.closest('.item-card');
  const dataId = Number(card.dataset.id);

  console.log('Removendo produto ID:', dataId);

  // Chama a função lógica para diminuir ou remover do array carrinho
  diminuirOuRemoverProduto(dataId);

  return dataId;
}

//--------------- Função lógica para diminuir quantidade ou tirar do carrinho ---------------//
function diminuirOuRemoverProduto(idProduto) {
  // Encontra o índice do produto no carrinho
  const index = carrinho.findIndex(item => item.idProduto === idProduto);

  if (index !== -1) {
    const produtoNoCarrinho = carrinho[index];
    const preco = produtoNoCarrinho.precoProduto;

    // Diminui a quantidade
    produtoNoCarrinho.qntProduto -= 1;

    // Se a quantidade ainda for maior que 0, apenas atualiza o subtotal
    if (produtoNoCarrinho.qntProduto > 0) {
      produtoNoCarrinho.subTotalProduto = produtoNoCarrinho.qntProduto * preco;
      console.log(`Quantidade diminuída!`, produtoNoCarrinho);
    } else {
      // Se chegou a 0, remove o item completamente do array carrinho
      carrinho.splice(index, 1);
      console.log(`Produto removido totalmente do carrinho! ID: ${idProduto}`);
    }
  } else {
    console.warn(`Produto com ID ${idProduto} não foi encontrado no carrinho.`);
  }
  renderizarCarrinho();
}

//--------------- Função verificar adição de produtos ---------------//
function addProduto(dataId, dataNome) {
  const idBusca = Number(dataId);

  // Busca o produto no cardápio
  const produtoEncontrado = dadosCardapio
    .flatMap(categoria => categoria.produtos)
    .find(produto => produto.id === idBusca);

  // Se não existir no cardápio, para por aqui
  if (!produtoEncontrado) {
    console.error(`Erro: Produto com ID ${dataId} não foi encontrado no cardápio!`);
    return;
  }

  // Delega a responsabilidade de atualizar/adicionar ao carrinho
  atualizarCarrinho(produtoEncontrado, dataNome);
}

//--------------- Função adicionar produtos ---------------//
function atualizarCarrinho(produtoCardapio, dataNome) {
  const produtoNoCarrinho = carrinho.find(item => item.idProduto === produtoCardapio.id);
  const preco = produtoCardapio.preco;
  const img = produtoCardapio.imagem;

  if (produtoNoCarrinho) {
    // Se já existe, apenas incrementa quantidade e subtotal
    produtoNoCarrinho.qntProduto += 1;
    produtoNoCarrinho.subTotalProduto = produtoNoCarrinho.qntProduto * preco;
    console.log(`Quantidade atualizada no carrinho!`, produtoNoCarrinho);
  } else {
    // Se não existe, cria um novo objeto e adiciona
    const novoProduto = {
      idProduto: produtoCardapio.id,
      imgProduto: img,
      nomeProduto: dataNome,
      precoProduto: preco,
      qntProduto: 1,
      subTotalProduto: preco
    };

    carrinho.push(novoProduto);
    console.log(`Produto cadastrado com sucesso!`, novoProduto);
  }
  renderizarCarrinho();
}

function renderizarCarrinho() {
  const containerCarrinho = document.getElementById('itens-carrinho');
  const totalCarrinho = document.getElementById('total-carrinho');
  
  containerCarrinho.innerHTML = carrinho.map(item => `
    <div class="carrinho-item" data-id="${item.idProduto}">
    <div class="carrinho-titulo">
    <img src="${item.imgProduto}" alt="${item.imgProduto}">
    <h3>${item.nomeProduto}</h3>
    </div>
    <div class="carrinho-preco">
    <h3>R$ ${item.precoProduto*item.qntProduto}</h3>
    <div id="">
    <div class="carrinho-qnt">
    <button>&#43;</button>
    <p>${item.qntProduto}</p>
    <button>&#8722;</button>
    </div>
    </div>
    </div>
    </div>
    `).join('');

  const total = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    totalCarrinho.innerText = `R$ ${total.toFixed(2)}`;
}

//--------------- Função para calcular o total do pedido ---------------//
function somarSubTotal() {
  let subTotal = carrinho.reduce((acumulador, item) => acumulador + item.subTotalProduto, 0);
  console.log(subTotal);
}

//-------------------- Função de injetar html  --------------------//
function renderizarLoja() {
  return `
  <div class="header-container">
    <div class="header-card">
      <img src="${loja.url_img}" alt="${loja.url_img}">
      <h2>${loja.nome}</h2>
      <p>${loja.descricao}</p>
      <div class="text">
        <p class="hora">&bull; Aberto até 22h00</p>
        <p>&bull; Sem pedido minimo</p>
      </div>
    </div>
  </div>
  `;
}

function renderizarContainerFinal() {
  return `
  <div class="card">
    <button>
      <img src="/public/icon/home.png" alt="">
      <p>Inicio</p>
    </button>
    <button onclick="navegarPara('carrinho')">
      <img src="/public/icon/shopping-cart.png" alt="">
      <div id="preco-cart" class="cart">
      </div>
    </button>
  </div>
  `;
}

function renderizarPrecoCart() {
  const subtotal = carrinho.reduce((acumulador, item) => acumulador + item.subTotalProduto, 0);
  console.log("O valor de subtotal é:", subtotal);

  const carrinhoHtml = `<p>Carrinho</p>`;
  const preco = `<p class="cart-itens">${subtotal}</p>`;

  if (subtotal > 0) {
    return preco;
  } else {
    return carrinhoHtml;
  }
}

function renderizarBtnCart(qnt = 1) {
  if (qnt < 1) {
    return `
      <div class="item-qnt">
        <button class="btn-mais" onclick="addCarrinho(this)">&#43;</button>
        <p>${qnt}</p>
        <button class="btn-menos" onclick="removeCarrinho(this)">&#8722;</button>
      </div>`;
  }

  return `
    <div class="item-qnt">
      <button class="btn-mais" onclick="addCarrinho(this)">&#43;</button>
    </div>`;
}

function montar() {
  const appContainer = document.getElementById('loja');
  appContainer.innerHTML = renderizarLoja();

  const containerFinal = document.getElementById('final-container');
  containerFinal.innerHTML = renderizarContainerFinal();

  const cart = document.getElementById('preco-cart');
  cart.innerHTML = renderizarPrecoCart();
}

montar();


// Função que renderiza o HTML (aquela mesma que ajustamos antes)
function renderizarCardapio(dados) {
  const container = document.getElementById('cardapio-container');
  container.innerHTML = '';

  dados.forEach(categoriaObj => {
    const categoriaDiv = document.createElement('div');
    categoriaDiv.classList.add('categoria-container');

    let htmlContent = `<h2>${categoriaObj.categoria}</h2>`;
    htmlContent += `<div class="item-container">`;

    categoriaObj.produtos.forEach(produto => {
      const precoFormatado = produto.preco.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });

      // Passa a quantidade do produto (ou 0 se ainda não tiver no carrinho)
      const qntAtual = cartTeste.total || 0;

      htmlContent += `
        <div class="item-card" data-id="${produto.id}" data-nome="${produto.nome}">
          <div class="item-org">
            <div class="g-esquerda">
              <img src="${produto.imagem}" alt="${produto.nome}">
              <div class="item-text">
                <h3>${produto.nome}</h3>
                <p class="descricao-cardapio">${produto.descricao}</p>
                <h3>${precoFormatado}</h3>
              </div>
            </div>
            <div class="btn-quantidade">
            ${renderizarBtnCart(qntAtual)}
            </div>
          </div>
        </div>
      `;
    });

    htmlContent += `</div>`;
    categoriaDiv.innerHTML = htmlContent;
    container.appendChild(categoriaDiv);
  });
}

// Nova função para buscar o arquivo JSON externo
async function carregarCardapio() {
  try {
    // Faz a requisição para buscar o arquivo (ajuste o caminho se necessário)
    const resposta = await fetch('produtos.json');

    // Verifica se o arquivo foi encontrado com sucesso
    if (!resposta.ok) {
      throw new Error('Não foi possível carregar o arquivo produtos.json');
    }

    // Converte a resposta do arquivo para um objeto/array JavaScript
    dadosCardapio = await resposta.json();

    // Chama a função de renderização passando os dados carregados
    renderizarCardapio(dadosCardapio);

  } catch (erro) {
    console.error('Erro ao carregar o cardápio:', erro);
  }
}

// Executa a função assim que o script rodar
carregarCardapio();


//--------------- Funçao Modal Inicio ---------------//
/*const abrir = document.getElementById('abrir');
const modal = document.getElementById('modal-produto');
const fechar = document.getElementById('fechar');

abrir.addEventListener('click', () => {
  modal.showModal();
})

fechar.addEventListener('click', () => {
  modal.close();
})*/
//--------------- Funçao Modal Final ---------------//