const buttonRegisterClient = document.getElementById('registerClient');
const modal = document.getElementById('modal');
const excludeModal = document.getElementById('modalExclude');
const modalClose = document.getElementById('modalClose');
const buttonSave = document.getElementById('save');
const buttonCancel = document.getElementById('cancel');
const buttonCancelWarning = document.getElementById('cancel2');
const buttonExclude = document.getElementById('exclude');
const form = document.getElementById('form');
const fieldName = document.getElementById('name');
const fieldEmail = document.getElementById('email');
const fieldPhone = document.getElementById('phone');
const fieldCity = document.getElementById('city');
let toDeleteIndex = null;

const openModal = () => {
    modal.classList.add('active');
};

const openModalWarning = () => excludeModal.classList.add('active');

const closeModal = () => {
    clearFields();
    modal.classList.remove('active');
};

const closeModalWarning = () => {
    excludeModal.classList.remove('active');
};

const getLocalStorage = () =>
    JSON.parse(localStorage.getItem('db_client') ?? '[]');

const setLocalStorage = dbClient =>
    localStorage.setItem('db_client', JSON.stringify(dbClient));

//CRUD - create read update delete
const deleteClient = index => {
    const dbClient = readClient();
    console.log(index);
    dbClient.splice(index, 1);
    setLocalStorage(dbClient);
};

const updateClient = (index, client) => {
    const dbClient = readClient();
    console.log(index, client);
    dbClient[index] = client;
    setLocalStorage(dbClient);
};

const readClient = () => getLocalStorage();

const createClient = client => {
    const dbClient = getLocalStorage();
    dbClient.push(client);
    setLocalStorage(dbClient);
};

const isValidFields = () => {
    return form.reportValidity();
};

const saveClient = () => {
    if (isValidFields()) {
        const client = {
            nome: fieldName.value,
            email: fieldEmail.value,
            celular: fieldPhone.value,
            cidade: fieldCity.value
        };
        const index = document.getElementById('name').dataset.index;
        if (index == 'new') {
            createClient(client);
            updateTable();
            closeModal();
        } else {
            updateClient(index, client);
            updateTable();
            closeModal();
        }
    }
};

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field');
    fields.forEach(field => (field.value = ''));
};

const createRow = (client, index) => {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.email}</td>
        <td>${client.celular}</td>
        <td>${client.cidade}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">editar</button>
            <button type="button" class="button red" id="delete-${index}">excluir</button>
        </td>
    `;

    document.querySelector('#tableClient > tbody').appendChild(newRow);
};

const clearTable = () => {
    const rows = document.querySelectorAll('#tableClient > tbody tr');
    rows.forEach(row => row.parentNode.removeChild(row));
};

const updateTable = () => {
    const dbClient = readClient();
    clearTable();
    dbClient.forEach(createRow);
};

const fillFields = client => {
    fieldName.value = client.nome;
    fieldEmail.value = client.email;
    fieldPhone.value = client.celular;
    fieldCity.value = client.cidade;
    fieldName.dataset.index = client.index;
};

const editClient = index => {
    const client = readClient()[index];
    client.index = index;
    fillFields(client);
    openModal();
};

const confirmDeleteClient = () => {
    if (toDeleteIndex === null) {
        return;
    }
    deleteClient(toDeleteIndex);
    updateTable();
    closeModalWarning();
    toDeleteIndex = null;
};

const editOrDelete = event => {
    if (event.target.type == 'button') {
        const [action, index] = event.target.id.split('-');

        if (action == 'edit') {
            editClient(index);
        } else {
            const client = readClient()[index];
            let warningDelete = document.querySelector('#warningDelete');

            warningDelete.textContent = `Deseja realmente excluir o cliente ${client.nome}?`;

            openModalWarning();
            toDeleteIndex = index;
        }
    }
};

updateTable();

//eventos
buttonRegisterClient.addEventListener('click', openModal);
buttonCancel.addEventListener('click', closeModal);
buttonSave.addEventListener('click', saveClient);
document
    .querySelector('#tableClient > tbody')
    .addEventListener('click', editOrDelete);
buttonCancelWarning.addEventListener('click', closeModalWarning);
buttonExclude.addEventListener('click', confirmDeleteClient);
