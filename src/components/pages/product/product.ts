import Swiper from "swiper";
import { Attribute, TypedMoney } from "@commercetools/platform-sdk";
import { getProduct } from "../../../sdk/sdk";
import Popap from "../../popap/popap";
import {
  productPageSwiperMainSetting,
  productPageSwiperPopapSetting,
} from "../../slider/swiper";
import { productPopap } from "./productPopap";
import { ProductControl } from "./productControl";

export class Product {
  private static DOM = {
    get quantityMinus() {
      return document.querySelector(".product_quantity__minus");
    },
    get quantityPlus() {
      return document.querySelector(".product_quantity__plus");
    },
    get quantityNum() {
      return document.querySelector(".product_quantity__num");
    },
    get sku() {
      const skuBox = document.querySelector(".sku_value");
      if (!skuBox) throw new Error("skuBox is not found");
      const value = skuBox.textContent;
      return value;
    },
  };

  public static async init(keyData = "") {
    let key = keyData;
    if (key === "") {
      key = Product.checkURL();
    }

    const resp = (await getProduct(key)).body;
    console.log(resp);
    const DOM = {
      imgs: document.querySelector(".product_page__slider-main"),
      sliderMain: document.querySelector(".product_page__slider-main"),
      productBreadcrumbs: document.querySelector(".breadcrumbs li:last-child"),
      name: document.querySelector(".product_page__name"),
      brend: document.querySelector(".product_page__brand .value"),
      colorBox: document.querySelector(".product_page__color"),
      color: document.querySelector(
        ".product_page__color .product_item__value",
      ),
      sizes: document.querySelector(".product_page__items.sizes"),
      // quantityMinus: document.querySelector(".product_quantity__minus"),
      quantityNum: document.querySelector(".product_quantity__num"),
      // quantityPlus: document.querySelector(".product_quantity__plus"),
      startPrise: document.querySelector(".sizes__item.product_page__prise"),
      salePrise: document.querySelector(".product_page__sale_prise"),
      description: document.querySelector(".product_deail__description"),
      sku: document.querySelector(".sku_value"),
      addBagBtn: document.querySelector(".product_page__btn.bag"),
    };

    const data = {
      slides: resp.masterVariant.images?.reduce((acc: HTMLElement[], img) => {
        const el = Product.createSlide(`${img.url}`, "swiper-slide__content");
        acc.push(el);
        return acc;
      }, []),
      slidesPopap: resp.masterVariant.images?.reduce(
        (acc: HTMLElement[], img) => {
          const el = Product.createSlide(`${img.url}`, "swiper-slide__content");
          acc.push(el);
          return acc;
        },
        [],
      ),
      name: resp.name.en,
      mainAttrubutes: Product.getAttrubutes(resp.masterVariant?.attributes),
      variantAttrubutes: resp.variants.map((variant) =>
        Product.getAttrubutes(variant.attributes),
      ),
      getStartPrise() {
        if (
          resp.masterVariant.prices === undefined ||
          resp.masterVariant.prices?.length <= 0
        )
          return "";
        const { value } = resp.masterVariant.prices[0];
        return Product.getPrise(value);
      },
      getSalePrise() {
        if (
          resp.masterVariant.prices === undefined ||
          resp.masterVariant.prices?.length <= 0 ||
          resp.masterVariant.prices[0].discounted === undefined
        )
          return "";
        const { value } = resp.masterVariant.prices[0].discounted;
        return Product.getPrise(value);
      },
      description: resp.description?.en,
      sku: [resp.masterVariant.sku, ...resp.variants.map((el) => el.sku)],
    };
    const productPageSwiperMain = new Swiper(
      ".product_page__swiper-main",
      productPageSwiperMainSetting,
    );
    Product.createSlides(data.slides, productPageSwiperMain);

    Product.clickSlide(DOM.sliderMain, data.slidesPopap, productPageSwiperMain);

    Product.showContent(DOM.name, data.name);
    Product.showContent(DOM.productBreadcrumbs, data.name);

    Product.showContent(DOM.brend, data.mainAttrubutes.brend);

    Product.showContent(DOM.color, data.mainAttrubutes.color);
    if (
      data.mainAttrubutes.color === "" &&
      DOM.colorBox &&
      DOM.colorBox instanceof HTMLElement
    ) {
      DOM.colorBox.style.display = "none";
    }
    Product.createSizes(
      DOM.sizes,
      data.mainAttrubutes,
      data.variantAttrubutes,
      data.sku,
    );
    Product.clickSizes(DOM.sizes, DOM.sku);
    Product.showContent(DOM.startPrise, data.getStartPrise());
    Product.showContent(DOM.salePrise, data.getSalePrise());
    Product.checkPrice(DOM.startPrise, DOM.salePrise);
    Product.showContent(DOM.description, data.description);
    Product.showContent(DOM.sku, data.sku[0]);
    Product.clickAddBagBtn(DOM.addBagBtn, DOM.quantityNum);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const productControl = new ProductControl(
      this.DOM.quantityPlus,
      this.DOM.quantityNum,
      this.DOM.quantityMinus,
      this.DOM.sku,
    );
  }

  private static checkURL() {
    const value = window.location.href.split("/").slice(-1).join("");
    if (value.startsWith("product__")) {
      return value.replace("product__", "");
    }
    return "";
  }

  private static createSlide(url: string, className: string) {
    const box = document.createElement("div");
    box.classList.add(className);
    box.innerHTML = `<img class="product_page__img" src="${url}" alt="slide"></img>`;
    return box;
  }

  private static createSlides(
    slideContent: HTMLElement[] | undefined,
    slider: Swiper,
  ) {
    if (slideContent === undefined) return;
    const slides = slideContent?.map((el) => {
      const box = document.createElement("div");
      box.classList.add("swiper-slide");
      box.append(el);
      return box;
    });
    if (slides !== undefined) {
      slider.appendSlide(slides);
    }
  }

  private static clickSlide(
    slider: Element | null,
    data: HTMLElement[] | undefined,
    mainSlider: Swiper | Swiper[] | undefined,
  ) {
    slider?.addEventListener("click", (e) => {
      if (
        e.target instanceof HTMLElement &&
        e.target.classList.contains("product_page__img") &&
        mainSlider !== undefined &&
        mainSlider instanceof Swiper
      ) {
        const activeSlide = mainSlider.activeIndex;
        productPageSwiperPopapSetting.initialSlide = activeSlide;

        Popap.open(productPopap);
        const productPageSwiperPopap = new Swiper(
          ".product_page__swiper-popap",
          productPageSwiperPopapSetting,
        );
        productPageSwiperPopap.update();
        Product.createSlides(data, productPageSwiperPopap);
        productPageSwiperPopap.controller.control = mainSlider;
      }
    });
  }

  private static showContent(domEl: Element | null, data: string | undefined) {
    if (!(domEl instanceof HTMLElement) || !domEl) return;
    if (data === undefined) {
      domEl.textContent = "";
      return;
    }
    domEl.textContent = data;
  }

  private static getAttrubutes(res: Attribute[] | undefined) {
    const result = {
      color: "",
      size: "",
      brend: "",
      prise: "",
    };
    if (res !== undefined) {
      res.forEach((el) => {
        switch (el.name) {
          case "color":
            result.color = el.value.label;
            break;
          case "size":
            result.size = el.value.label;
            break;
          case "brend":
            result.brend = el.value.label;
            break;
          case "price":
            result.prise = el.value.label;
            break;
          default:
            break;
        }
      });
    }
    return result;
  }

  private static createSizes(
    box: Element | null,
    main: { color: string; size: string; brend: string; prise: string },
    variant: { color: string; size: string; brend: string; prise: string }[],
    skuArr: (string | undefined)[],
  ) {
    if (!box) return;
    const elements = [main, ...variant];
    if (elements.length === 0 && box.parentElement instanceof HTMLElement) {
      box.parentElement.style.display = "none";
    }
    elements.forEach((attributes, index) => {
      const el = document.createElement("li");
      if (skuArr[index] !== undefined) {
        el.setAttribute("sku", `${skuArr[index]}`);
      }
      el.classList.add("sizes__item");
      if (index === 0) {
        el.classList.add("active");
      }
      el.textContent = attributes.size;
      box.append(el);
    });
  }

  private static getPrise(data: TypedMoney | undefined) {
    if (data === undefined) return "";
    const value = (data.centAmount / 10 ** data.fractionDigits).toFixed(2);
    return `${value} ${data.currencyCode}`;
  }

  private static checkPrice(priseBox: Element | null, saleBox: Element | null) {
    if (!priseBox && !saleBox) return;
    if (saleBox?.textContent === "" && priseBox?.classList.contains("sale")) {
      priseBox?.classList.remove("sale");
    } else if (!priseBox?.classList.contains("sale")) {
      priseBox?.classList.add("sale");
    }
  }

  private static clickSizes(box: Element | null, skuBox: Element | null) {
    if (!(box instanceof HTMLElement)) return;
    box.addEventListener("click", (e) => {
      if (
        !box ||
        !(e.target instanceof HTMLElement) ||
        !e.target.classList.contains("sizes__item") ||
        !(box instanceof HTMLElement)
      )
        return;
      Array.from(box.getElementsByClassName("sizes__item")).forEach((el) => {
        if (el.classList.contains("active")) el.classList.remove("active");
      });
      if (!e.target.classList.contains("active"))
        e.target.classList.add("active");
      const skuValue = e.target.getAttribute("sku");
      if (skuBox && skuValue) {
        skuBox.textContent = skuValue;
      }
    });
  }

  private static clickAddBagBtn(
    btn: Element | null,
    quantityNum: Element | null,
  ) {
    if (!btn || !(quantityNum instanceof HTMLInputElement)) return;
    btn.addEventListener("click", () => {
      if (quantityNum && btn.classList.contains("remove")) {
        quantityNum.value = `0`;
      }
      btn.classList.toggle("remove");
    });
  }

  private static getElemText(box: Element | null) {
    if (box) {
      return box.textContent;
    }
    return "";
  }

  // private static async showQuantity(
  //   box: Element | HTMLInputElement | null,
  //   skuBox: string | null,
  // ) {
  //   if (!box || !skuBox || !(box instanceof HTMLInputElement)) return;
  //   const cartData = await CartAPI.checkMyCart();
  //   if (cartData === null || cartData.products === undefined || skuBox === "") {
  //     box.value = "0";
  //     return;
  //   }
  //   const num = await cartData.products.get(`${skuBox}`);
  //   if (num === undefined) {
  //     box.value = "0";
  //   } else {
  //     box.value = `${num.quantity}`;
  //   }
  // }
}
