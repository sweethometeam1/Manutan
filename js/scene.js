const solution = {
  'id': '520',
  'outline': [],
  'data': {
    'furniture_cad': [],
    'furniture_info': [
      {
        'name': 'armchair',
        'image': '/assets/images/stage_4/urban_9/alternatives/sofa3sit_1_1.jpg',
        'id': 'BodilAccentChairGreyLeather',
        'assetUrl': 'https://renovai-models.s3.us-east-2.amazonaws.com/models/office-demo/bodilaccentchairgreyleather',
        'assetName': 'Assets/Office/Prefabs/Armchairs/BodilAccentChairGreyLeather.prefab',
        'info': ['Houzz', 'Angled Leather Sofa'],
        'price': 5800,
        types: ['Armchairs (1)', 'Armchairs (2)']
      }
    ],
    'alternatives': {
      'armchair': [
        {
          'name': 'armchair',
          'image': '/assets/images/stage_4/urban_9/alternatives/sofa3sit_1_1.jpg',
          'id': 'BodilAccentChairGreyLeather',
          'assetUrl': 'https://renovai-models.s3.us-east-2.amazonaws.com/models/office-demo/bodilaccentchairgreyleather',
          'assetName': 'Assets/Office/Prefabs/Armchairs/BodilAccentChairGreyLeather.prefab',
          'info': ['Houzz', 'Angled Leather Sofa'],
          'price': 5800,
          types: ['Armchairs (1)', 'Armchairs (2)']
        },
        {
          'name': 'armchair',
          'image': '/assets/images/stage_4/urban_9/alternatives/sofa3sit_1_1.jpg',
          'id': 'MilnerReclinerChair',
          'assetUrl': 'https://renovai-models.s3.us-east-2.amazonaws.com/models/office-demo/milnerreclinerchair',
          'assetName': 'Assets/Office/Prefabs/Armchairs/MilnerReclinerChair.prefab',
          'info': ['Houzz', 'Angled Leather Sofa'],
          'price': 5800,
          types: ['Armchairs (1)', 'Armchairs (2)']
        },
        {
          'name': 'armchair',
          'image': '/assets/images/stage_4/urban_9/alternatives/sofa3sit_1_1.jpg',
          'id': 'NevadaArmchairAntiqueCognacLeather',
          'assetUrl': 'https://renovai-models.s3.us-east-2.amazonaws.com/models/office-demo/nevadaarmchairantiquecognacleather',
          'assetName': 'Assets/Office/Prefabs/Armchairs/NevadaArmchairAntiqueCognacLeather.prefab',
          'info': ['Houzz', 'Angled Leather Sofa'],
          'price': 5800,
          types: ['Armchairs (1)', 'Armchairs (2)']
        },
        {
          'name': 'armchair',
          'image': '/img/product1.jpg',
          'id': 'NevadaArmchairAntiqueWhiteLeather',
          'assetUrl': 'https://renovai-models.s3.us-east-2.amazonaws.com/models/office-demo/nevadaarmchairantiquewhiteleather',
          'assetName': 'Assets/Office/Prefabs/Armchairs/NevadaArmchairAntiqueWhiteLeather.prefab',
          'info': ['Houzz', 'Angled Leather Sofa'],
          'price': 5800,
          types: ['Armchairs (1)', 'Armchairs (2)']
        }
      ]
    }
  }
};
let unityInstance = null;
let loadedItemsCount = 0;
let infoPopupData = null;

window.loadUnitySetup = () => {
  solution.data.furniture_info.map(f =>
    f.types.map(t => unityInstance.SendMessage(
      t,
      'Load',
      f.assetUrl + '|' + f.assetName + '|' + f.id + '|true'
    ))
  );
};
window.unityItemLoaded = () => {
  loading = false;
  loadedItemsCount++;
  if (loadedItemsCount === solution.data.furniture_info.length) {
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

$(document).on('click', '.steps', () => {
  unityInstance.SendMessage('CameraSwitch', 'ChangeCamera', 'walk');
})

$(document).on('click', '.ddd', () => {
  unityInstance.SendMessage('CameraSwitch', 'ChangeCamera', 'orbit');
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
        <div class="shop-item shop-${k}-item-${i}" data-model-url="${t.assetUrl}|${t.assetName}|${t.id}|true" data-type="${t.types}">
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
      currentItem.attr('data-type').map(t =>
        unityInstance.SendMessage(
          t,
          'Load',
          currentItem.attr('data-model-url')
        )
      )
    });
  })
/*  unityInstance = UnityLoader.instantiate(
    'unityContainer',
    '/scenes/office/Build/office.json',
  );
  window.unityInstance = unityInstance*/
})


function loadAllModels() {
  const { alternatives } = solution.data
  Object.keys(alternatives).map(k =>
    alternatives[k].map(
      f.types.map(t => unityInstance.SendMessage(
        t,
        'Load',
        f.assetUrl + '|' + f.assetName + '|' + f.id
      ))
    ), 1);
}
