(function main () {

    /* navigator is a WEB API that allows scripts to register themselves and carry out their activities. */
     if ('serviceWorker' in navigator) {
         console.log('Service Worker is supported in your browser')
         /* register method takes in the path of service worker file and returns a promises, which returns the registration object */
         navigator.serviceWorker.register('./service-worker.js').then (registration => {
             console.log('Service Worker is registered!')
         })
     } else {
         console.log('Service Worker is not supported in your browser')
     }

 const pokemonBerriesUrl = 'https://pokeapi.co/api/v2/berry/'
    fetch(pokemonBerriesUrl)
        .then (response => {
            return response.json()
        })
        .then (data => {
            renderBerriesList(data)
        })

    function renderBerriesList (data) {
        let berriesList = data.results

        let berriesListContainer = createNode('div', '', { class: 'berries-list' })
        appendToParent(null, berriesListContainer)
        let berriesHeading = createNode('div', 'Click on any of the Berries to know more about it!', { class: 'berries-heading' })
        appendToParent(berriesListContainer, berriesHeading)

        berriesList.map (berry => {
            let berryContainer = createNode('div', berry.name, { class: 'berry', click: () => getBerryDesc(berry.url) })
            appendToParent(berriesListContainer, berryContainer)
        })
    }

    function createNode (element, text, options) {
        let container = document.createElement(element)
        container.innerHTML = text

        if (options) {
            Object.keys(options).map (key => {
                if (key === 'click') {
                    container.addEventListener('click', options[key])
                } else {
                    container.setAttribute(key, options[key])
                }

            })
        }

        return container
    }

    function appendToParent(parent, child) {
        let parentContainer = parent
        if (!parent) {
            parentContainer = document.getElementById('pokemon-app')
        }

        parentContainer.appendChild(child)
    }

    function getBerryDesc (berriesUrl) {
        fetch(berriesUrl)
            .then (response => {
                return response.json()
            })
            .then (data => {
                renderBerriesDesc(data)
            })
    }

    function renderBerriesDesc (data) {

        let staleBerriesNode = document.getElementById('berries-desc')
        if (staleBerriesNode) {
            staleBerriesNode.remove()
        }

        let berriesDesc = ''

        berriesDesc += "<table>"

        data && Object.keys(data).map (key => {
            let keyType = knowType(data[key])
            if (keyType === 'string' || keyType === 'number') {
                berriesDesc += constructTableRow(key, data[key])
            }
        })
        berriesDesc += "</table>"

        let berriesDescContainer = createNode('div', berriesDesc, { id: 'berries-desc' })
        appendToParent(null, berriesDescContainer)
    }

    function knowType (key) {
        let toString = Object.prototype.toString
        let type = toString.call(key)

        switch (type) {
            case '[object String]': return 'string'
            case '[object Number]': return 'number'
        }
    }

    function constructTableRow (key, value) {
        return "<tr><td>" + key + "</td><td>" + value + "</td></tr>"
    }

})()