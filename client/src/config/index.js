export const registerFormControls = [
  {
    name: 'userName',
    label: 'User Name',
    placeholder: 'Enter your user name',
    componentType: 'input',
    type: 'text',
  },
  {
    name: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    componentType: 'input',
    type: 'email',
  },
  {
    name: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    componentType: 'input',
    type: 'password',
  },
];

export const loginFormControls = [
  {
    name: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    componentType: 'input',
    type: 'email',
  },
  {
    name: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    componentType: 'input',
    type: 'password',
  },
];

export const addProductFormElements = [
  {
    title: 'Title',
    name: 'title',
    componentType: 'input',
    type: 'text',
    placeholder: 'Enter product title',
  },
  {
    title: 'Description',
    name: 'description',
    componentType: 'textarea',
    placeholder: 'Enter product description',
  },
  {
    title: 'Category',
    name: 'category',
    componentType: 'select',
    options: [
      { id: 'painting', label: 'Painting' },
      { id: 'sculpture', label: 'Sculpture' },
      { id: 'photography', label: 'Photography' },
      { id: 'men', label: 'Men' },
      { id: 'women', label: 'Women' },
      { id: 'kids', label: 'Kids' },
      { id: 'accessories', label: 'Accessories' },
      { id: 'footwear', label: 'Footwear' },
    ],
  },
  {
    title: 'Price',
    name: 'price',
    componentType: 'input',
    type: 'number',
    placeholder: 'Enter product price',
  },
  {
    title: 'Sale Price',
    name: 'salePrice',
    componentType: 'input',
    type: 'number',
    placeholder: 'Enter sale price (optional)',
  },
  {
    title: 'Total Stock',
    name: 'totalStock',
    componentType: 'input',
    type: 'number',
    placeholder: 'Enter total stock',
  },
];

export const addAuctionProductElements = [
  {
    label: 'Title',
    name: 'title',
    componentType: 'input',
    type: 'text',
    placeholder: 'Enter artwork title',
  },
  {
    label: 'Description',
    name: 'description',
    componentType: 'textarea',
    placeholder: 'Enter artwork description',
  },
  {
    label: 'Artist Name',
    name: 'artist',
    componentType: 'input',
    type: 'text',
    placeholder: 'Enter artist name',
  },
  {
    label: 'Starting Bid',
    name: 'startingBid',
    componentType: 'input',
    type: 'number',
    placeholder: 'Enter starting bid amount',
  },
  {
    label: 'Bid Increment',
    name: 'bidIncrement',
    componentType: 'input',
    type: 'number',
    placeholder: 'Enter minimum bid increment',
  },
  {
    label: 'Start Time',
    name: 'startTime',
    componentType: 'input',
    type: 'datetime-local',
    placeholder: 'Select auction start time',
  },

  {
    label: 'End Time',
    name: 'endTime',
    componentType: 'input',
    type: 'datetime-local',
    placeholder: 'Select auction end time',
  },
  {
    label: 'Is Active',
    name: 'isActive',
    componentType: 'checkbox',
  },
];

export const addressFormControls = [
  {
    label: 'Address',
    name: 'address',
    componentType: 'input',
    type: 'text',
    placeholder: 'Enter your address',
  },
  {
    label: 'City',
    name: 'city',
    componentType: 'input',
    type: 'text',
    placeholder: 'Enter your city',
  },
  {
    label: 'Pincode',
    name: 'pincode',
    componentType: 'input',
    type: 'text',
    placeholder: 'Enter your pincode',
  },
  {
    label: 'Phone',
    name: 'phone',
    componentType: 'input',
    type: 'text',
    placeholder: 'Enter your phone number',
  },
  {
    label: 'Notes',
    name: 'notes',
    componentType: 'textarea',
    placeholder: 'Enter any additional notes',
  },
];

// {
// 	label: "Brand",
// 	name: "brand",
// 	componentType: "select",
// 	options: [
// 		{ id: "nike", label: "Nike" },
// 		{ id: "adidas", label: "Adidas" },
// 		{ id: "puma", label: "Puma" },
// 		{ id: "levi", label: "Levi's" },
// 		{ id: "zara", label: "Zara" },
// 		{ id: "h&m", label: "H&M" },
// 	],
// },

export const shoppingViewHeaderMenuItems = [
  {
    id: 'home',
    label: 'Home',
    path: '/',
  },
  {
    id: 'auction',
    label: 'Auction',
    path: '/shop/auction',
  },
  {
    id: 'products',
    label: 'Products',
    path: '/shop/listing',
  },
  {
    id: 'men',
    label: 'Men',
    path: '/shop/listing',
  },
  {
    id: 'women',
    label: 'Women',
    path: '/shop/listing',
  },
  {
    id: 'kids',
    label: 'Kids',
    path: '/shop/listing',
  },
  {
    id: 'search',
    label: 'Search',
    path: '/shop/search',
  },
];

export const categoryOptionsMap = {
  painting: 'Painting',
  sculpture: 'Sculpture',
  photography: 'Photography',
  drawing: 'Drawing',
  printmaking: 'Printmaking',
  collage: 'Collage',
  digital: 'Digital Art',
  mixedmedia: 'Mixed Media',
  ceramics: 'Ceramics',
  glass: 'Glass Art',
  textile: 'Textile Art',
  installation: 'Installation',
  performance: 'Performance Art',
  men: 'Men',
  women: 'Women',
  kids: 'Kids',
  accessories: 'Accessories',
  footwear: 'Footwear',
};

// export const brandOptionsMap = {
// 	nike: "Nike",
// 	adidas: "Adidas",
// 	puma: "Puma",
// 	levi: "Levi",
// 	zara: "Zara",
// 	"h&m": "H&M",
// };

export const filterOptions = {
  category: [
    { id: 'painting', label: 'Painting' },
    { id: 'sculpture', label: 'Sculpture' },
    { id: 'photography', label: 'Photography' },
    { id: 'drawing', label: 'Drawing' },
    { id: 'printmaking', label: 'Printmaking' },
    { id: 'collage', label: 'Collage' },
    { id: 'digital', label: 'Digital Art' },
    { id: 'mixedmedia', label: 'Mixed Media' },
    { id: 'ceramics', label: 'Ceramics' },
    { id: 'glass', label: 'Glass Art' },
    { id: 'textile', label: 'Textile Art' },
    { id: 'installation', label: 'Installation' },
    { id: 'performance', label: 'Performance Art' },
    { id: 'men', label: 'Men' },
    { id: 'women', label: 'Women' },
    { id: 'kids', label: 'Kids' },
    { id: 'accessories', label: 'Accessories' },
  ],
};

// brand: [
// 	{ id: "nike", label: "Nike" },
// 	{ id: "adidas", label: "Adidas" },
// 	{ id: "puma", label: "Puma" },
// 	{ id: "levi", label: "Levi's" },
// 	{ id: "zara", label: "Zara" },
// 	{ id: "h&m", label: "H&M" },
// ],

export const sortOptions = [
  { id: 'price-lowtohigh', label: 'Price: Low to High' },
  { id: 'price-hightolow', label: 'Price: High to Low' },
  { id: 'title-atoz', label: 'Title: A to Z' },
  { id: 'title-ztoa', label: 'Title: Z to A' },
];
