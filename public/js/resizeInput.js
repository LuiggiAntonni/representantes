$("#image-input").on('change', function () {
    try {
        if (typeof (FileReader) != "undefined") {
            $('#image-text-form').hide()
            var image_holder = $("#image-holder");
            image_holder.empty();
    
            var reader = new FileReader();
            reader.onload = function (e) {
                $("<img />", {
                    "src": e.target.result,
                    "class": "thumb-image-form"
                }).appendTo(image_holder);
    
            }
            image_holder.show();
            reader.readAsDataURL($(this)[0].files[0]);
        }
    } catch (error) {
        Toastify({
            text: "Erro ao carregar imagem",
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
        $('#image-text-form').show()
    }
});