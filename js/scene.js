const solution = {
  'id': '520',
  'outline': [],
  'data': {
    'furniture_cad': [],
    'furniture_info': [],
    'alternatives': {}
  },
  'ctime': new Date('2019-06-11T13:47:21.361701Z'),
  'style': 'urban_9',
  'image': '/assets/images/stage_4/urban_9/reference.jpg',
  'owner': 'f97cd08d-19e7-4f01-afbf-bc3902bd81aa'
};
let unityInstance = null;
let loadedItemsCount = 0;
let infoPopupData = null;

window.loadUnitySetup = () => {
  console.log('scene loading time', Date.now() - this.startDate);
  solution.data.furniture_info.map(f =>
    unityInstance.SendMessage(
      f.type,
      'Load',
      f.assetUrl + '|' + f.assetName + '|' + f.id + '|true'
    )
  );
};
window.unityItemLoaded = () => {
  loading = false;
  loadedItemsCount++;
  if (loadedItemsCount === solution.data.furniture_info.length) {
    unityInstance.SendMessage('CameraSwitch', 'ChangeCamera', 'orbit');
    $('.loading').removeClass('waiting');
    $('.imagination').addClass('start');
    loadAllModels();
  }
};
window.openPopup = (x, y, id) => {
  infoPopupData = {
    x,
    y,
    item: solution.data.furniture_info.find(f => f.id === id)
  };
}
window.addEventListener('keydown', (event) => {
  infoPopupData = null;
});
window.addEventListener('mousedown', (event) => {
  infoPopupData = null;
});
window.addEventListener('mousewheel', (event) => {
  infoPopupData = null;
});

$('.poll').on('afterChange', (event, slick, currentSlide) => {
  if (currentSlide === $('.poll-item').length - 1) {
    unityInstance = UnityLoader.instantiate(
      'unityContainer',
      '/scenes/office/Build/office.json',
    );

    $('.loading').addClass('waiting');
    event.preventDefault();
  }
})

$(document).on('click', '.change-walls-color-button', () => {
  unityInstance.SendMessage('Walls', 'ChooseNextMat');
})

$(document).ready(() => {
  Object.keys(solution.data.alternatives).map(k => {
    $('.imagination-list').append(`
      <div class="shop-wrapper">
        <div class="shop shop-${k}"></div>
        <div class="shop-nav-${k} shop-nav">
            <button type="button" class="slick-next shop-nav__next shop-nav-${k}__next"></button>
            <button type="button" class="slick-prev shop-nav__prev shop-nav-${k}__next"></button>
        </div>
      </div>
    `)
    const type = solution.data.alternatives[k]
    type.map((t, i) => {
      $(`.shop-${k}`).append(`
        <div class="shop-item shop-${k}-item-${i}" data-model-url="${t.assetUrl}|${t.assetName}|${t.id}|true" data-type="${t.type}">
            <div class="shop-container">
                <div class="shop-item__img">
                    <img src="${t.image}" alt="shop-img" title="shop-img">
                </div>
                <div class="shop-item__info">
                    <h3>${t.info.join(' ')}</h3>
                    <p>${t.price},00 €</p>
                </div>
                <div class="shop-item__bucket">
                    <a href="#"><span class="icon-cart"></span></a>
                </div>
            </div>
        </div>
      `)
    })

    const prevArrow = $(`.shop-nav-${k}__next.shop-nav__prev`);
    const nextArrow = $(`.shop-nav-${k}__next.shop-nav__next`);

    const shop = $(`.shop-${k}`)

    shop.slick({
      arrows: true,
      autoplay: false,
      prevArrow,
      nextArrow,
      fade: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      focusOnChange: false,
      focusOnSelect: false,
      infinite: true,
      dots: true,
    });

    shop.on('afterChange', function(event, slick, currentSlide){
      const currentItem = $(`.shop-${k}-item-${currentSlide}`);
      unityInstance.SendMessage(
        currentItem.attr('data-type'),
        'Load',
        currentItem.attr('data-model-url')
      )
    });
  })
  /*unityInstance = UnityLoader.instantiate(
    'unityContainer',
    '/scenes/Build/Build.json',
  );*/
})


function loadAllModels() {
  const { alternatives } = solution.data
  Object.keys(alternatives).map(k =>
    alternatives[k].map(f => unityInstance.SendMessage(
      f.type,
      'Load',
      f.assetUrl + '|' + f.assetName + '|' + f.id
    ), 1)
  );
}
