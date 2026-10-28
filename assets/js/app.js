var cl = console.log;

const state = {
    postsArr: [],
    edit_id: null
}


const BASE_URL = `https://gaurav2-1b96d-default-rtdb.firebaseio.com/`
const POST_URL = `${BASE_URL}/PostsfetchGeneric1.json`

const postForm = document.getElementById("postForm")
const title = document.getElementById("title")
const content = document.getElementById("content")
const addBtn = document.getElementById("addBtn")
const updateBtn = document.getElementById("updateBtn")
const tbody = document.getElementById("tbody")
const editBtn = document.getElementById("editBtn")
const deleteBtn = document.getElementById("deleteBtn")
const detailsRow = document.getElementById("detailsRow")

// ========================= Generic function ======================
async function makeGenericApiCall(URL, METHOD, BODY) {
    try {
        BODY = BODY ? JSON.stringify(BODY) : null

        let res = await fetch(URL, {
            method: METHOD,
            body: BODY,
            headers: {
                "Content-Type": "Application/json",
                "Autherization": "JWT TOKEN"
            }
        })
        if (!res.ok) {
            throw new Error(`HTTP Error ${res.status}`)
        }

        let data = await res.json()
        return data
    } catch (err) {
        cl(`API Error : ${err}`)
        throw err
    }
}
// ========================= Create ================================
async function addNewPost(eve) {
    try {
        eve.preventDefault()

        let newPost = {
            title: title.value,
            content: content.value,
            updatedAt: "null",
            createdAt: Date.now(),
        }

        showSpinner("text-success")
        let data = await makeGenericApiCall(POST_URL, "POST", newPost)
        newPost.id = data.name
        state.postsArr.unshift(newPost)
        cl(state.postsArr)

        let tr = document.createElement("tr")
        tr.id = data.name
        tr.innerHTML = `
                            <td>1</td>
                            <td>${newPost.title}</td>
                            <td>${newPost.content}</td>
                            <td>${new Date(newPost.createdAt).toLocaleDateString()}</td>
                            <td>${"Just Created"}</td>
                            <td>
                                <div class="actions">
                                    <button onClick="editPost(this)" id="editBtn" type="button" class="btn btn-warning"> Edit </button>
                                    <button onClick="deletePost(this)" id="deleteBtn" type="button" class="btn btn-danger"> Delete </button>
                                </div>
                            </td>       
                        `

        tbody.prepend(tr)
        let td = [...document.querySelectorAll("#tbody tr")]
        td.forEach((ele, i) => {
            ele.querySelector("td").innerText = i + 1
        });
        postForm.reset()
        showSnackBar("Added!", "Post Added successfully", "success")
        hideSpinner("text-success")
    } catch (err) {
        hideSpinner("text-success")
        showSnackBar("Error", err, "error")
    }

}
// ========================= Read ==================================
async function fetchPosts(arr) {
    try {

        showSpinner("text-success")
        let data = await makeGenericApiCall(POST_URL, "GET")
        for (const key in data) {
            data[key].id = key
            state.postsArr.unshift(data[key])
        }
        let result = ''
        arr.forEach(ele => {
            cl(ele.updatedAt)
            result += ` <tr id = ${ele.id}>
                            <td>1</td>
                            <td>${ele.title}</td>
                            <td>${ele.content}</td>
                            <td>${new Date(ele.createdAt).toLocaleDateString()}</td>
                            <td>${ele.updatedAt === "null" ? "Not Updated" : new Date(ele.updatedAt).toLocaleDateString()}</td>
                            <td>
                                <div class="actions">
                                    <button onClick="editPost(this)" id="editBtn" type="button" class="btn btn-warning"> Edit </button>
                                    <button onClick="deletePost(this)" id="deleteBtn" type="button" class="btn btn-danger"> Delete </button>
                                </div>
                            </td> 
                        </tr>
            `
        });

        tbody.innerHTML = result
        let td = [...document.querySelectorAll("#tbody tr")]
        td.forEach((ele, i) => {
            ele.querySelector("td").innerText = i + 1
        });
        hideSpinner("text-success")
    } catch (err) {
        hideSpinner("text-success")
        showSnackBar("Error", err, "error")
    }
}
fetchPosts(state.postsArr)
// ========================= Edit ==================================
async function editPost(ele) {
    try {
        let EDIT_ID = ele.closest("tr").id
        let EDIT_URL = `${BASE_URL}/PostsfetchGeneric1/${EDIT_ID}.json`

        showSpinner("text-success")
        let data = await makeGenericApiCall(EDIT_URL, "GET")
        title.value = data.title,
            content.value = data.content

        addBtn.classList.add("d-none")
        updateBtn.classList.remove("d-none")

        state.edit_id = EDIT_ID
        hideSpinner("text-success")
    } catch (err) {
        hideSpinner("text-success")
        showSnackBar("Error", err, "error")
    }
}
// ========================= Update ================================ 
async function updatePost(ele) {
    try {
        let UPDATE_ID = state.edit_id
        let UPDATE_URL = `${BASE_URL}/PostsfetchGeneric1/${UPDATE_ID}.json`

        let updatedPostObj = {
            title: title.value,
            content: content.value,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            id: UPDATE_ID
        }
        showSpinner("text-success")
        let data = await makeGenericApiCall(UPDATE_URL, "PATCH", updatedPostObj)
        state.edit_id = null
        let getIndex = state.postsArr.findIndex(ele => ele.id === UPDATE_ID)
        state.postsArr[getIndex] = updatedPostObj

        document.getElementById(UPDATE_ID).innerHTML = `
                            <td>1</td>
                            <td>${updatedPostObj.title}</td>
                            <td>${updatedPostObj.content}</td>
                            <td>${updatedPostObj.createdAt}</td>
                            <td>${new Date(updatedPostObj.updatedAt).toLocaleDateString()}</td>
                            <td>
                                <div class="actions">
                                    <button onClick="editPost(this)" id="editBtn" type="button" class="btn btn-warning"> Edit </button>
                                    <button onClick="deletePost(this)" id="deleteBtn" type="button" class="btn btn-danger"> Delete </button>
                                </div>
                            </td>`
        let td = [...document.querySelectorAll("#tbody tr")]
        td.forEach((ele, i) => {
            ele.querySelector("td").innerText = i + 1
        });

        addBtn.classList.remove("d-none")
        updateBtn.classList.add("d-none")
        postForm.reset()
        showSnackBar("Updated!", "Post Updated successfully", "success")
        hideSpinner("text-success")
    } catch (err) {
        hideSpinner("text-success")
        showSnackBar("Error", err, "error")
    }
}
// ========================= Delete ================================
async function deletePost(ele) {
    try {
        let DELETE_ID = ele.closest("tr").id
        let DELETE_URL = `${BASE_URL}/PostsfetchGeneric1/${DELETE_ID}.json`

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                showSpinner("text-danger")
                let data = await makeGenericApiCall(DELETE_URL, "DELETE")
                let getIndex = state.postsArr.findIndex(ele => ele.id === DELETE_ID)
                state.postsArr.splice(getIndex, 1)

                ele.closest("tr").remove()
                let td = [...document.querySelectorAll("#tbody tr")]
                td.forEach((ele, i) => {
                    ele.querySelector("td").innerText = i + 1
                });
                showSnackBar("Removed!", "Post removed successfully", "success")
                hideSpinner("text-danger")
            }
        });
    } catch (err) {
        hideSpinner("text-danger")
        showSnackBar("Error", err, "error")
    }
}

function showSnackBar(title, msg, icon) {
    Swal.fire({
        title: title,
        text: msg,
        icon: icon
    });
}
function showSpinner(color) {
    spinner.classList.remove("d-none")
    spinner.classList.add(color)
}
function hideSpinner(color) {
    spinner.classList.add("d-none")
    spinner.classList.remove(color)
}


postForm.addEventListener("submit", addNewPost)
updateBtn.addEventListener("click", updatePost)


























