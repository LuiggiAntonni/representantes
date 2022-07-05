function createCatalogosHtml(result) {
    return `<li>  
                <div class="card" style="width: 18rem;"><img class="card-img-top" src="/images/${result.imagem}" alt="Foto do catalogo" />
                    <div class="card-body" id="${result.CatalogoID}">
                        <h5 class="card-title">${result.name}</h5>
                        <p class="card-text">${result.ano}</p><a class="btn btn-primary" href="/rep/catalogo/${result.email_FK}/${result.CatalogoID}">Editar</a>
                        <p></p>
                    </div>
                </div>
            </li>`
}

function output(results, container) {
    container.html("");

    if (!Array.isArray(results)) {
        results = [results];
    }

    results.forEach(result => {
        var html = createCatalogosHtml(result)
        container.append(html);
    });

    if (results.length == 0) {
        container.append("<span class='noResults'>Nenhum Catalogo</span>")
    }
}

$(document).ready(() => {
    $.get(`/api/catalogo/${emailPayload}`, (results) => {
        return output(results, $(".catalogos"))
    })
})