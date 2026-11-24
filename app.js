// Navegação entre sections
function navegarPara(paginaId) {
  const paginas = document.querySelectorAll('.page');
  paginas.forEach(pagina => pagina.classList.remove('active'));

  const botoesNav = document.querySelectorAll('.nav-btn');
  botoesNav.forEach(botao => botao.classList.remove('active'));

  const paginaAlvo = document.getElementById(paginaId);
  if (paginaAlvo) {
    paginaAlvo.classList.add('active');
  }

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

let carrinho = [];
let dadosCardapio = [];

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

function obterQuantidadeNoCarrinho(idProduto) {
  const item = carrinho.find(prod => prod.idProduto === Number(idProduto));
  return item ? item.qntProduto : 0;
}

function calcularTotalCarrinho() {
  return carrinho.reduce((acumulador, item) => acumulador + item.subTotalProduto, 0);
}

//--------------- Função Trazer ID do Produto ---------------//
function addCarrinho(botao) {
  const card = botao.closest('.item-card');
  if (!card) return;

  const dataId = card.dataset.id;
  const dataNome = card.dataset.nome;

  addProduto(dataId, dataNome);
  return dataId;
}

//--------------- Função Remover ou Diminuir do Carrinho ---------------//
function removeCarrinho(botao) {
  const card = botao.closest('.item-card');
  if (!card) return;

  const dataId = Number(card.dataset.id);
  diminuirOuRemoverProduto(dataId);
  return dataId;
}

//--------------- Função lógica para diminuir quantidade ou tirar do carrinho ---------------//
function diminuirOuRemoverProduto(idProduto) {
  const idBusca = Number(idProduto);
  const index = carrinho.findIndex(item => item.idProduto === idBusca);

  if (index !== -1) {
    const produtoNoCarrinho = carrinho[index];
    const preco = Number(produtoNoCarrinho.precoProduto);

    produtoNoCarrinho.qntProduto -= 1;

    if (produtoNoCarrinho.qntProduto > 0) {
      produtoNoCarrinho.subTotalProduto = produtoNoCarrinho.qntProduto * preco;
    } else {
      carrinho.splice(index, 1);
    }
  } else {
    console.warn(`Produto com ID ${idBusca} não foi encontrado no carrinho.`);
  }

  atualizarInterfaceCarrinho();
}

//--------------- Função verificar adição de produtos ---------------//
function addProduto(dataId, dataNome) {
  const idBusca = Number(dataId);

  const produtoEncontrado = dadosCardapio
    .flatMap(categoria => categoria.produtos || [])
    .find(produto => Number(produto.id) === idBusca);

  if (!produtoEncontrado) {
    console.error(`Erro: Produto com ID ${dataId} não foi encontrado no cardápio!`);
    return;
  }

  const nomeFinal = dataNome || produtoEncontrado.nome;
  atualizarCarrinho(produtoEncontrado, nomeFinal);
}

//--------------- Função adicionar produtos ---------------//
function atualizarCarrinho(produtoCardapio, dataNome) {
  const produtoNoCarrinho = carrinho.find(
    item => item.idProduto === Number(produtoCardapio.id)
  );
  const preco = Number(produtoCardapio.preco);
  const img = produtoCardapio.imagem;

  if (produtoNoCarrinho) {
    produtoNoCarrinho.qntProduto += 1;
    produtoNoCarrinho.subTotalProduto = produtoNoCarrinho.qntProduto * preco;
  } else {
    const novoProduto = {
      idProduto: Number(produtoCardapio.id),
      imgProduto: img,
      nomeProduto: dataNome,
      precoProduto: preco,
      qntProduto: 1,
      subTotalProduto: preco
    };

    carrinho.push(novoProduto);
  }

  atualizarInterfaceCarrinho();
}

function atualizarInterfaceCarrinho() {
  renderizarCarrinho();
  atualizarPrecoCart();
  atualizarBotoesCardapio();
}

function renderizarCarrinho() {
  const containerCarrinho = document.getElementById('itens-carrinho');
  const totalCarrinho = document.getElementById('total-carrinho');
  const total = calcularTotalCarrinho();

  if (containerCarrinho) {
    if (carrinho.length === 0) {
      containerCarrinho.innerHTML = `<p class="carrinho-vazio">Seu carrinho está vazio.</p>`;
    } else {
      containerCarrinho.innerHTML = carrinho.map(item => `
        <div class="carrinho-item" data-id="${item.idProduto}">
          <div class="carrinho-titulo">
            <img src="${item.imgProduto}" alt="${item.nomeProduto}">
            <h3>${item.nomeProduto}</h3>
          </div>
          <div class="carrinho-preco">
            <h3>${formatarMoeda(item.subTotalProduto)}</h3>
            <div class="carrinho-qnt">
              <button type="button" onclick="diminuirOuRemoverProduto(${item.idProduto})">&#8722;</button>
              <p>${item.qntProduto}</p>
              <button type="button" onclick="addProduto(${item.idProduto}, '${item.nomeProduto.replace(/'/g, "\\'")}')">&#43;</button>
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  if (totalCarrinho) {
    totalCarrinho.innerText = formatarMoeda(total);
  }
}

function atualizarPrecoCart() {
  const cart = document.getElementById('preco-cart');
  if (!cart) return;
  cart.innerHTML = renderizarPrecoCart();
}

function atualizarBotoesCardapio() {
  const cards = document.querySelectorAll('.item-card');
  cards.forEach(card => {
    const id = Number(card.dataset.id);
    const btnContainer = card.querySelector('.btn-quantidade');
    if (btnContainer) {
      const qntAtual = obterQuantidadeNoCarrinho(id);
      btnContainer.innerHTML = renderizarBtnCart(qntAtual);
    }
  });
}

//-------------------- Função de injetar HTML --------------------//
function renderizarLoja() {
  return `
  <div class="header-container">
    <div class="header-card">
      <img src="${loja.url_img}" alt="${loja.nome}">
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
    <button type="button" onclick="navegarPara('inicio')">
      <img src="/public/icon/home.png" alt="Início">
      <p>Inicio</p>
    </button>
    <button type="button" onclick="navegarPara('carrinho')">
      <img src="/public/icon/shopping-cart.png" alt="Carrinho">
      <div id="preco-cart" class="cart"></div>
    </button>
  </div>
  `;
}

function renderizarPrecoCart() {
  const subtotal = calcularTotalCarrinho();

  if (subtotal > 0) {
    return `<p class="cart-itens">${formatarMoeda(subtotal)}</p>`;
  }

  return `<p>Carrinho</p>`;
}

function renderizarBtnCart(qnt = 0) {
  if (qnt > 0) {
    return `
      <div class="item-qnt">
        <button type="button" class="btn-menos" onclick="removeCarrinho(this)">&#8722;</button>
        <p>${qnt}</p>
        <button type="button" class="btn-mais" onclick="addCarrinho(this)">&#43;</button>
      </div>`;
  }

  return `
    <div class="item-qnt">
      <button type="button" class="btn-mais" onclick="addCarrinho(this)">&#43;</button>
    </div>`;
}

function montar() {
  const appContainer = document.getElementById('loja');
  if (appContainer) {
    appContainer.innerHTML = renderizarLoja();
  }

  const containerFinal = document.getElementById('final-container');
  if (containerFinal) {
    containerFinal.innerHTML = renderizarContainerFinal();
  }

  atualizarInterfaceCarrinho();
}

montar();

function renderizarCardapio(dados) {
  const container = document.getElementById('cardapio-container');
  if (!container) return;
  container.innerHTML = '';

  dados.forEach(categoriaObj => {
    const categoriaDiv = document.createElement('div');
    categoriaDiv.classList.add('categoria-container');

    let htmlContent = `<h2>${categoriaObj.categoria}</h2>`;
    htmlContent += `<div class="item-container">`;

    (categoriaObj.produtos || []).forEach(produto => {
      const precoFormatado = formatarMoeda(produto.preco);
      const qntAtual = obterQuantidadeNoCarrinho(produto.id);

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

async function carregarCardapio() {
  try {
    const resposta = await fetch('produtos.json');

    if (!resposta.ok) {
      throw new Error('Não foi possível carregar o arquivo produtos.json');
    }

    dadosCardapio = await resposta.json();
    renderizarCardapio(dadosCardapio);
    atualizarBotoesCardapio();
  } catch (erro) {
    console.error('Erro ao carregar o cardápio:', erro);
  }
}

carregarCardapio();