
document.addEventListener("DOMContentLoaded", footer);


function footer (){
    setTimeout(()=>{
        fetch("../../backend/footer.json")
            .then(response => response.json())
            .then(data => {
                let v = Object.values(data);
                const column_name = document.querySelectorAll('.column-footer p');
                const links = document.querySelectorAll('.column-footer a');

                document.querySelector("#footer-name").textContent = v[0];
                v = v.slice(1);
                console.log(v);
                console.log(links.length);

                Object.entries(data).slice(1).forEach(([name, x], index) => {
                    column_name[index].textContent = name;
                });

                for(let i = 0; i < links.length; i++) {
                    if (i<=2){
                        links[i].textContent = v[0][i%3];
                    }
                    else if(i===3){
                        links[i].href="../HTML/incidents.html";
                        links[i].textContent = v[1];
                    }
                    else{
                        links[i].textContent = v[2];
                    }
                }
            });
    },100);
}
