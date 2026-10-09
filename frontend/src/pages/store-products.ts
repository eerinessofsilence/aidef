export type StoreCategory = "pistols" | "automatic" | "accessories";
export type StoreAccessoryCategory = "all" | "suppressors" | "sights" | "other";

export type StoreProduct = {
  id: string;
  name: string;
  brand: string;
  category: StoreCategory;
  accessoryCategory?: Exclude<StoreAccessoryCategory, "all">;
  image: string;
  width: number;
  height: number;
  artist: string;
  source: string;
  license: string;
  licenseUrl: string;
};

export const storeProducts: StoreProduct[] = [
  {
    id: "g36", name: "G36", brand: "Heckler & Koch", category: "automatic",
    image: "/store/research/g36.png", width: 1150, height: 400,
    artist: "DomoK / Auge=mit", source: "https://commons.wikimedia.org/wiki/File:Gewehr_G36_noBG.png",
    license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  {
    id: "mp7", name: "MP7", brand: "Heckler & Koch", category: "automatic",
    image: "/store/research/mp7.png", width: 2040, height: 1169,
    artist: "KrisfromGermany", source: "https://commons.wikimedia.org/wiki/File:HK_MP7_Bundeswehr_noBG.png",
    license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  {
    id: "usp", name: "USP", brand: "Heckler & Koch", category: "pistols",
    image: "/store/research/usp.png", width: 1920, height: 1280,
    artist: "lifesizepotato", source: "https://commons.wikimedia.org/wiki/File:First-year_H%26K_USP_9mm_(32415150000)_modified.png",
    license: "CC0", licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
  },
  {
    id: "hk416n", name: "HK416N", brand: "Heckler & Koch", category: "automatic",
    image: "/store/research/hk416n.png", width: 2143, height: 834,
    artist: "Dybdal", source: "https://commons.wikimedia.org/wiki/File:HK416N.png",
    license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
  },
  {
    id: "g27", name: "G27", brand: "Heckler & Koch", category: "automatic",
    image: "/store/research/g27.png", width: 3000, height: 1410,
    artist: "Wald-Burger8", source: "https://commons.wikimedia.org/wiki/File:Combater_G27_noBG.png",
    license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
  },
  {
    id: "g3", name: "G3", brand: "Heckler & Koch", category: "automatic",
    image: "/store/research/g3.png", width: 1220, height: 600,
    artist: "Armémuseum / Swedish Army Museum", source: "https://commons.wikimedia.org/wiki/File:Heckler_%26_Koch_G3_Holzschaft_Display_noBG.png",
    license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  {
    id: "mp5-a3", name: "MP5 A3", brand: "Heckler & Koch", category: "automatic",
    image: "/store/research/mp5-a3.png", width: 1250, height: 550,
    artist: "Dybdal / Mattes", source: "https://commons.wikimedia.org/wiki/File:HK_MP5_noBG.png",
    license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
  },
  {
    id: "p30l", name: "P30L", brand: "Heckler & Koch", category: "pistols",
    image: "/store/research/p30l.png", width: 1300, height: 950,
    artist: "Koalorka", source: "https://commons.wikimedia.org/wiki/File:Koalorka_H%26K_P30L_noBG.png",
    license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  {
    id: "p99", name: "P99", brand: "Walther", category: "pistols",
    image: "/store/research/p99.png", width: 1740, height: 1321,
    artist: "Sirimiri~commonswiki (Commons attribution)", source: "https://commons.wikimedia.org/wiki/File:Walther_P99_9x19mm.png",
    license: "CC BY 2.5", licenseUrl: "https://creativecommons.org/licenses/by/2.5/",
  },
  {
    id: "ppk-l", name: "PPK-L", brand: "Walther", category: "pistols",
    image: "/store/research/ppk-l.png", width: 1100, height: 800,
    artist: "Michael Sullivan", source: "https://commons.wikimedia.org/wiki/File:Walther_PPK-L_noBG.png",
    license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  {
    id: "arc-reflex", name: "ARC Reflex", brand: "Aster", category: "accessories", accessoryCategory: "sights",
    image: "/store/accessories/arc-reflex.svg", width: 900, height: 620,
    artist: "", source: "", license: "", licenseUrl: "",
  },
  {
    id: "orbit-holo", name: "ORBIT Holo", brand: "Aster", category: "accessories", accessoryCategory: "sights",
    image: "/store/accessories/orbit-holo.svg", width: 900, height: 620,
    artist: "", source: "", license: "", licenseUrl: "",
  },
  {
    id: "veil-suppressor", name: "VEIL Suppressor", brand: "Aster", category: "accessories", accessoryCategory: "suppressors",
    image: "/store/accessories/veil-suppressor.svg", width: 900, height: 620,
    artist: "", source: "", license: "", licenseUrl: "",
  },
  {
    id: "luma-light", name: "LUMA Light", brand: "Aster", category: "accessories", accessoryCategory: "other",
    image: "/store/accessories/luma-light.svg", width: 900, height: 620,
    artist: "", source: "", license: "", licenseUrl: "",
  },
];

export const storeCategories: StoreCategory[] = ["pistols", "automatic", "accessories"];
export const storeAccessoryCategories: StoreAccessoryCategory[] = [
  "all",
  "suppressors",
  "sights",
  "other",
];
export const storeContactProducts = storeProducts.map((product) => ({
  value: product.id,
  label: `${product.brand} ${product.name}`,
  category: product.category,
}));
