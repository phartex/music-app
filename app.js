
const alternate = document.getElementsByClassName('.centered')
const form = document.getElementById('form')
const search = document.getElementById('search')
const result = document.getElementById('result')
const more = document.getElementById('more')

const apiURL = 'https://api.lyrics.ovh';

// searchSongs

async function searchSongs(searchTerm){
    const res = await fetch(`${apiURL}/suggest/${searchTerm}`)
    const data = await res.json()

    showData(data);
    // const ans = data.data[0].title;

    // result.innerHTML=ans
}

// show data(to display result in DOM)

function showData(data) {
    result.innerHTML = `
        <ul class="songs"> ${data.data.map(song =>
            `<li>
            <span><strong>${song.artist.name}</strong>-${song.title}</span>
            <button class="btn" data-artist = '${song.artist.name}' data-songtitle = '${song.title}'>
            Get lyrics</button>
            </li> `
            ).join('')
        }
            
        </ul>
    `;
    if (data.prev || data.next) {
        more.innerHTML = `
        ${data.prev ? `<button class='btn' onclick='getMoreSongs('${data.prev}')>prev</button>`:''}
        ${data.next ? `<button class='btn' onclick='getMoreSongs('${data.next}') >next</button>`:''}
        `
    }
    else{
        more.innerHTML = ''
    }
}

async function getLyrics(artist, songTitle) {
    const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`)
    const data = await res.json()
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g,'<br>')

    result.innerHTML = `
        <h2><strong>${artist}</strong>-${songTitle}</h2>
        <span>${lyrics}</span>
    `
}

result.addEventListener('click', e =>{
    const clickedEL = e.target;
    if (clickedEL.tagName === 'BUTTON'){
        const artist = clickedEL.getAttribute('data-artist')
        const songTitle = clickedEL.getAttribute('data-songtitle')
        
        getLyrics(artist,songTitle)
    } else {
        console.log('fool')
    }
})


// to display next and prev
async function getMoreSongs(url){
    const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`)
    const data = await res.json()

    showData(data);
}

// Event listeners

form.addEventListener('submit',e =>{
    e.preventDefault();
    const searchTerm = search.value.trim();
    
    if (!searchTerm){
        alert('please type something')
    } else{
        searchSongs(searchTerm)
    };
})




