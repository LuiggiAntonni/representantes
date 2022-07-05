$(document).ready((result) => {
    $.get(`/api/catalogo/${emailPayload}/${IDPayload}`, (results) => {
        return $("#nomeDoCatalogo").text(`${results[0].name}`)
    })
    $.get(`/api/produtos/${emailPayload}/${IDPayload}`, (results) => {
        return output(results, $(".produtos"))
    })
    if (result.mensagem != undefined) {
        Toastify({
            text: `${result.mensagem}`,
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)",
            }
        }).showToast()
    }
})

function telaCarregar() {
    $('.carregando').show();
}

function createProdutos(result) {
    return `<div class="card col produto-container" id="${result.catalogo_FK}">
                <div class="imagem-container">
                    <div class="produto-botoes">
                        <button class="removedor">
                            <span onclick='deletar(${result.catalogo_FK},${result.id});' class="material-symbols-outlined">delete</span>
                        </button>
                        <button class="d-grid gap-2 d-md-flex justify-content-md-end float-end clonador" onclick='clonar(${result.catalogo_FK},${result.id});' data-bs-placement="top" data-bs-toggle="tooltip"
                        title="Aperte para clonar o produto, isso facilita na hora de adicionar novos produtos">
                            <span class="material-symbols-outlined">control_point_duplicate</span>
                        </button>
                    </div>
                    <img class="produto-imagem" src="/images/${result.imagem}" alt="Foto do produto" />
                    <div class="almbum-cores"> 
                        <ul class="ul-cores" id="${result.id}">${mostrarCores(result.cores, result.id)}</ul>
                    </div>
                </div>
                <div class="produto-info" id="${result.id}">
                    <h5 class="produto-titulo">${result.ref}</h5>
                    <div class="preco">
                        R$<span>${result.preco.toLocaleString('pt-br', {minimumFractionDigits: 2})}</span>
                    </div>
                    <div class="tamanhos-container">
                        <strong>${result.tamanhos}</strong>
                    </div>
                </div>
            </div>`
}

function mostrarCores(result, produtoID) {
    var html = '';
    const array = result.split('/')
    array.forEach((item, index) => {
        const valor = item.split("-")
        html += (`<span class="d-inline-block" tabindex="0" data-bs-toggle="tooltip" title="${valor[0]} (Cor do produto)">
                    <li onclick='modalCorItem(${index},${produtoID})' style="background-color:${valor[1]};" class="produto-cores-li" id="${valor[1]};">
                        <input type="hidden" value="${valor[1]}">
                        <span>${valor[0]}</span> 
                    </li>
                  </span>`)
    })
    return html
}

function clonar(catalogoID, produtoID, e) {
    var button = $('.clonador')
    button.prop('disabled', true)
    $.ajax({
        url: `/api/produto/${emailPayload}/${catalogoID}/${produtoID}`,
        type: 'PUT',
        success: function (result) {
            console.log(result)
            $.get(`/api/produtos/${emailPayload}/${IDPayload}`, (results) => {
                return output(results, $(".produtos"))
            })
            Toastify({
                text: "Produto clonado com sucesso",
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                    background: "linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)",
                }
            }).showToast();
            button.prop('disabled', false);
        },
        error: function () {
            Toastify({
                text: "Erro ao clonar o produto",
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                    background: "linear-gradient(160deg, #a73737 0%, #7a2828 100%)",
                }
            }).showToast();
        }
    });

}

function deletar(catalogo, produtoID) {
    $.ajax({
        url: `/api/produto/${emailPayload}/${catalogo}/${produtoID}`,
        type: "DELETE",
        success: (result) => {
            console.log(result)
            $.get(`/api/produtos/${emailPayload}/${IDPayload}`, (results) => {
                return output(results, $(".produtos"))
            })
            Toastify({
                text: `${result.mensagem}`,
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
                style: {
                    background: "linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)",
                }
            }).showToast();
        },
        error: (result) => {
            console.log(result)
            Toastify({
                text: `${result.mensagem}`,
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
                style: {
                    background: "linear-gradient(160deg, #a73737 0%, #7a2828 100%)",
                }
            }).showToast()
        }
    }).done((data) => {
        telaCarregar()
    })
}

function modalCorItem(index, produtoID) {
    var selecinar;
    $('#modal-form').empty();
    album = $('.ul-cores').filter(`#${produtoID}`).find("li")
    album.each((i, item) => {
        var div = document.createElement("div");
        div.className = "novaCores"
        var inputRef = document.createElement("input");
        inputRef.type = "text";
        inputRef.required = true;
        inputRef.className = "refNovaCorInput"
        inputRef.value = $(item).find('span').text();
        var inputCor = document.createElement("input");
        inputCor.type = "color";
        inputCor.required = true;
        inputCor.className = "novaCorInput"
        inputCor.value = $(item).find('input').val();
        $('#modal-form').append(div);
        $(div).append(inputRef);
        $(div).append(inputCor);
        if (i == index) {
            selecinar = inputRef
        }
    })
    $('#modal-form').append(`<input id="catalogoNovasCores" type="hidden" name="catalogo" value="${IDPayload}">
                             <input id="produtoNovasCores" type="hidden" name="produto" value="${produtoID}">
                             <input id="valorNovasCores" type="hidden" name="cores" value="${getCoresNovas()}">
                             <button id="atualizarNovasCores" type='submit'>Salvar</button>`);
    $('#modalCores').show();
    $(selecinar).select();
}

$('#modal-form').submit((event) => {
    $('#valorNovasCores').val(getCoresNovas());
    var formData = {
        produto: $("#produtoNovasCores").val(),
        catalogo: $("#catalogoNovasCores").val(),
        cores: $("#valorNovasCores").val(),
    };

    $.ajax({
        type: "POST",
        url: "/api/produto/mudarcor",
        data: formData,
        dataType: "json",
        encode: true,
        success: (result) => {
            Toastify({
                text: `${result.mensagem}`,
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
                style: {
                    background: "linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)",
                }
            }).showToast();
        },
    }).done(function (data) {
        console.log(data);
        $('#modalCores').hide();
        telaCarregar()
        $.get(`/api/produtos/${emailPayload}/${IDPayload}`, (results) => {
            return output(results, $(".produtos"))
        })
    });

    event.preventDefault();
});

function getCoresNovas() {
    let valor = '';
    $('.novaCores').each(function () {
        const ref = $(this).find('.refNovaCorInput').val().trim()
        let valor2 = `/${ref.replace(/[^\w\s]/gi, '')}-${$(this).find('.novaCorInput').val()}`
        valor += valor2
    });
    if (valor.charAt(0) === '/') valor = valor.substring(1);
    if (valor.charAt(valor.length - 1) === '/') valor = valor.substring(0, valor.length - 1);
    return valor
}

$('#modalCores').click((e) => {
    if (e.target.id === 'modalCores' || e.target.id === 'modal-fechar') {
        $('#modalCores').hide();
        $('modal-form').empty();
    }
})

function output(results, container) {
    $('.carregando').show();
    container.html("");

    if (!Array.isArray(results)) {
        results = [results];
    }

    results.forEach(result => {
        var html = createProdutos(result)
        container.append(html);
    });

    if (results.length === 0) {
        container.append("<span class='noResults'>Nenhum Produto</span>")
    }

    $('.carregando').hide();
}

function addInput() {
    const arrayTamanhos = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'XGG', 'EG', 'EGG']
    const inputSize = $('.tamanhos').length
    if (inputSize < 10) {
        var input = document.createElement("input");
        input.type = "text";
        input.className = "form-control tamanhos"
        input.required = true
        input.style = "text-transform:uppercase"
        input.maxLength = 20
        if (inputSize < arrayTamanhos.length) {
            input.value = arrayTamanhos[inputSize]
        } else {
            input.value = ''
        }
        $('#valorTamanhos').before(input)
        $(input).select()
    }
    $('#removedor').show()
}
//arrumar e tbm arrumar o cores
function removeInput() {
    if ($('.tamanhos').length > 1) {
        $('.tamanhos').last().remove()
    }
    if ($('.tamanhos').length <= 1) {
        $('#removedor').hide()
    }
}

function addCor() {
    const max = 10
    if ($('.cores').length < max) {
        var inputs = $("#cores1").clone()
        $("#atrasCores").before(inputs)
    }
    if ($('.cores').length >= max) {
        $('#addCor').prop("disabled", true)
    }
    $('#removedorCor').show()
}

function removeCor() {
    if ($('.cores').length > 1) {
        $('.cores').last().remove()
    }
    if ($('.cores').length <= 1) {
        $('#removedorCor').hide()
    }
    $('#addCor').prop("disabled", false)
}

function getCores() {
    let valor = '';
    $('.cores').each(function () {
        const ref = $(this).find('.refCorInput').val().trim()
        let valor2 = `/${ref.replace(/[^\w\s]/gi, '')}-${$(this).find('.corInput').val()}`
        valor += valor2
    });
    if (valor.charAt(0) === '/') valor = valor.substring(1);
    if (valor.charAt(valor.length - 1) === '/') valor = valor.substring(0, valor.length - 1);
    return valor
}

$("#addCor").click(function () {
    addCor();
});

$('#formPrincipal').submit(() => {
    let valor = '';
    $('.tamanhos').each(function () {
        let valor2 = `-${this.value.trim()}`
        valor += valor2
    });
    if (valor.charAt(0) === '-') valor = valor.substring(1);
    if (valor.charAt(valor.length - 1) === '-') valor = valor.substring(0, valor.length - 1);
    valor = valor.toLocaleUpperCase()
    const preco = (Math.round($('#precoInput').val() * 100) / 100).toFixed(2);
    $('#precoInput').val(preco)
    $('#valorTamanhos').val(valor);
    $('#valorCores').val(getCores());
    return true
});