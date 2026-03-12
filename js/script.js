const inputs = document.querySelectorAll('#productForm .form-control');
const form = document.querySelector('#productForm');
const viewTable = document.querySelector('#viewTable tbody');
const search = document.querySelector('.search input[type="search"]');
let data = {};
let list = JSON.parse(localStorage.getItem('list')) || [];
const editData = JSON.parse(localStorage.getItem('editData')) || {};
let atoz = document.getElementById('a-z');
let ztoa = document.getElementById('z-a');
let hightolow = document.getElementById('H-L');
let lowtohigh = document.getElementById('L-H');
let resetBtn = document.getElementById("reset");
 

search?.addEventListener('input', (e) => {
    // console.log(e);
    const { value } = e.target;

    let newList = list.filter(item =>
        item.name.toLowerCase().includes(value.toLowerCase()))
        handleView(newList)
    })


inputs.forEach((input) => {
    input.addEventListener('input', (e) => {
        let { name, value } = e.target
        data = { ...data, [name]: value }
        // console.log(data);   
    })
})

form?.addEventListener('submit', (e) => {
    e.preventDefault();
    let newlist = [];
    if (editData.id) {
        newlist = list.map((item) => {
            if (editData.id == item.id) {
                return { ...data, id: item.id };
            }
            return item;
        })
        localStorage.removeItem('editData')
    } else {
        newlist = [...list, { ...data, id: Date.now() }];
    }
    list = newlist;
    localStorage.setItem('list', JSON.stringify(list));
    window.location.href = './view.html'
    form.reset();
})

const handleView = (list) => {
    viewTable.innerHTML = '';
    list.forEach((value, index) => {
        const row = document.createElement('tr')
        row.innerHTML = `

            <td>${index + 1}</td>
            <td><img src="${value.image}" width="60" height="60" style="object-fit:cover;" alt="${value.name}"></td>
            <td>${value.name}</td>
            <td>${value.price}</td>
            <td>${value.category}</td>
            <td>${value.stock}</td>
            <td>${value.description}</td>
            <td>
                <button type="button" class="btn btn-danger" onclick="handleDelete(${value.id})">Delete</button>
                <button type="button" class="btn btn-success" onclick="handleEdit(${value.id})">Edit</button>
            </td>
        `
        viewTable.appendChild(row)
    })
}

const handleDelete = (id) => {
    // console.log(id);

    list = list.filter(item => item.id != id)
    localStorage.setItem('list', JSON.stringify(list))
    handleView(list);
}

const handleEdit = (id) => {
    // console.log(id);

    const data = list.find(item => item.id == id)
    localStorage.setItem('editData', JSON.stringify(data));
    window.location.href = './add.html'
}

if (viewTable) {
    handleView(list);
}


const handleEditData = () => {
    inputs?.forEach((input) => {
        const { name } = input;
        input.value = editData[name];
    })
}

if (editData.id) {
    data = editData;
    handleEditData();
}

atoz?.addEventListener("click", () => {
    sortProducts("atoz")
})

ztoa?.addEventListener("click", () => {
    sortProducts("ztoa")
})

lowtohigh?.addEventListener("click", () => {
    sortProducts("lowtohigh")
})

hightolow?.addEventListener("click", () => {
    sortProducts("hightolow")
})

resetBtn?.addEventListener("click", () => {
    handleView(list);
});

const sortProducts = (sort) => {

    let sortedList;

    if(sort === "atoz"){
        sortedList = [...list].sort((a,b)=> 
            a.name.localeCompare(b.name)
        );
    }

    else if(sort === "ztoa"){
        sortedList = [...list].sort((a,b)=> 
            b.name.localeCompare(a.name)
        );
    }

    else if(sort === "lowtohigh"){
        sortedList = [...list].sort((a,b)=> 
            a.price - b.price
        );
    }

    else if(sort === "hightolow"){
        sortedList = [...list].sort((a,b)=> 
            b.price - a.price
        );
    }

    handleView(sortedList);
}