export function previewUserImage(){
    const input = document.getElementById('fileInput');
    const preview = document.getElementById('imagenPreview');
    input.addEventListener('change', function () {
        const file = input.files[0];
        if (file) {
            const reader = new FileReader();

            reader.addEventListener('load', function () {
                preview.src = reader.result;
                preview.style.display = 'block';
            });

            reader.readAsDataURL(file);
        } else {
            preview.style.display = 'none';
        }
    });
}