(function () {
  //get elements
  const base_url = 'https://lighthouse-user-api.herokuapp.com'
  const index_url = base_url + '/api/v1/users/'
  const dataPanel = document.getElementById('data-panel')
  const data = []
  const searchInput = document.getElementById("search") //search name
  const searchBar = document.getElementById("search")
  const favoriteData = JSON.parse(localStorage.getItem('favorite')) //(方法-1)

  //Pagination
  const pagination = document.getElementById('pagination')
  const ITEM_PER_PAGE = 12
  let paginationData = []

  dataList(data) //使用原始資料(方法-1)
  //dataListAddTag(data) //使用加上favorite(tag)布林值的新資料(方法-2)

  //API取資料
  function dataList(data) {
    axios.get(index_url).then(response => {
      //console.log(response)
      data.push(...response.data.results)
      //console.log(data)
      //displayUser(data) //刪除整頁顯示
      getTotalPages(data) //改分頁顯示
      getPageData(1, data)
    }).catch(err => console.log(err))
  }

  //API取資料後，再加入Tag資料(方法-2)
  function dataListAddTag(data) {
    axios.get(index_url).then(response => {
      //console.log(response)
      const temp = response.data.results
      temp.forEach(function (profile) {
        data.push({ ...profile, favorite: false }) //增加favorite(tag)布林值至Data[]
      })
      //console.log(data)
      //displayUser(data) //刪除整頁顯示
      getTotalPages(data) //改分頁顯示
      getPageData(1, data)
    })
      .catch(err => console.log(err))
  }

  //01. Menu Navigation
  function menuSelect(event) {
    if (event.target.matches(".all")) {
      getPageData(1, data)
      getTotalPages(data)
    } else if (event.target.matches(".myfavorite")) { //切換為favorite資料顯示
      //const favoriteData = data.filter(user => user.favorite === true) //(方法-2)
      getPageData(1, favoriteData)
      getTotalPages(favoriteData)
    }
  }

  //02. Select Data Panel - card or "+" icon
  function dataPanelSelect(event) {
    if (event.target.matches('.card-img-top')) {
      console.log(event.target.dataset.id)
      let user_id = event.target.dataset.id
      const url = index_url + user_id
      console.log(url)
      axios.get(url).then(response => {
        const userItem = response.data
        showDetail(userItem)
        console.log(userItem)
      })
    } else if (event.target.matches(".fa-plus")) {
      console.log(event.target.dataset.id)
      addFavoriteItem(event.target.dataset.id)
    } else if (event.target.matches(".fa-minus")) {
      //console.log(event.target.dataset.id)
      removeFavoriteItem(event.target.dataset.id)
    }
  }

  //03. Print Data Panel to html & add "+" icon
  function displayUser(data) {
    let htmlContent = ''
    data.forEach(function (item, index) {
      htmlContent += `
        <div class="col-sm-3  mb-4">
          <div class="card h-100">
            <img class="card-img-top" src="${item.avatar}" alt="card image cap" data-toggle="modal" data-target="#show-user-detail" data-id="${item.id}">
            <div class="card-body">
              <h5 class="card-title">${item.name} ${item.surname}</h5>
            </div>
            <div class="card-footer">
              <span><i class="fa fa-plus" aria-hidden="true"  data-target="#data-panel" data-id="${item.id}"></i></span>
              <span><i class="fa fa-minus" aria-hidden="true"  data-target="#data-panel" data-id="${item.id}"></i></span>
            </div>  
          </div>
        </div>
      `
    })
    dataPanel.innerHTML = htmlContent
  }

  // 04. Print Data Panel - favoriated to html

  //05. Modal: Display User Detail
  function showDetail(userItem) {
    const content = document.getElementById('content')
    let htmlContent = ''
    htmlContent = `
      <div class="modal-header">
        <h4 class="modal-title" id="show-user-name">${userItem.name} ${userItem.surname}</h4>
      </div>
      <div class="modal-body" id="show-detail-body">
        <div class="row">
          <div class="col-sm-5 pb-4 pl-5" id="show-user-avatar">
            <img src="${userItem.avatar}" class="img-fluid" alt="responsive image">
          </div>
          <div class="col-sm-7 pt-3">
            <ul>
              <li>Age: ${userItem.age}</li>
              <li>Birthday: ${userItem.birthday}</li>
              <li>Gender: ${userItem.gender}</li>
              <li>Region: ${userItem.region}</li>
              <li>E-mail: ${userItem.email}</li>
            </ul>
          </div>    
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
      </div>
     `
    content.innerHTML = htmlContent
  }

  //06. Search Name
  function searchName(event) {
    event.preventDefault()
    const regex = new RegExp(searchInput.value, "i")
    let searchResult = data.filter(
      user => user.name.match(regex) || user.surname.match(regex)
    )
    //console.log(searchResult)
    getPageData(1, searchResult)
    getTotalPages(searchResult)
  }

  //07. Pagination 分頁
  function paginationView(event) {
    //console.log(event.target.dataset.page)
    currentPage = event.target.dataset.page  //更新currentPage值
    $('body').on('click', 'li', function () { //當前頁面增加active樣式讓使用者區分目前的頁面
      $('li.active').removeClass('active')
      $(this).addClass('active')
    });
    if (event.target.tagName === 'A') {
      getPageData(currentPage, paginationData)
    }
  }

  //08. 計算總分頁數目
  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }

  //09. 切換分頁
  function getPageData(pageNum, data) {
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displayUser(pageData)
  }

  //10. Add Favorite (方法-1)
  function addFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem('favorite')) || []
    const like = data.find(item => item.id === Number(id))
    if (list.some(item => item.id === Number(id))) {
      alert(`${like.name} is already in your favorite list.`)
    } else {
      list.push(like)
      alert(`Added ${like.name} to your favorite list!`)
    }
    localStorage.setItem('favorite', JSON.stringify(list))
    //console.log(list)
    //displayUser(list)
    window.location.href = window.location.href
    window.location.reload() //刷新頁面
  }

  //11. Remove Favorite (方法-1)
  function removeFavoriteItem(id) {
    //const favoriteData = data.filter(user => user.favorite === true) //(方法-2)
    const index = favoriteData.findIndex(item => item.id === Number(id)) //find user by id
    if (index === -1) return
    favoriteData.splice(index, 1)  //remove user and update localStorage
    localStorage.setItem('favorite', JSON.stringify(favoriteData))
    //console.log(favoriteData)
    displayUser(favoriteData) //repaint dataList
  }

  //Add Listener
  dataPanel.addEventListener("click", dataPanelSelect)
  searchBar.addEventListener("input", searchName)
  menu.addEventListener("click", menuSelect)
  pagination.addEventListener("click", paginationView)


})()

