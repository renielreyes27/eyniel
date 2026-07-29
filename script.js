const startBtn = document.getElementById("startBtn");

startBtn.onclick = () => {

    document.querySelector(".story").scrollIntoView({

        behavior:"smooth"

    });

}

const observer = new IntersectionObserver((entries)=>{

    entries.forEach((entry)=>{

        if(entry.isIntersecting){

            entry.target.classList.add("show");

        }

    });

});

document.querySelectorAll(".story-container").forEach((el)=>{

    el.classList.add("hidden");

    observer.observe(el);

});