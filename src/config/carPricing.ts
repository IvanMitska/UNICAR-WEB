/**
 * Индивидуальные тарифы для машин, которые не укладываются в общую сетку скидок.
 *
 * Ключ — id машины, значение — стоимость аренды за весь срок ДО акции (฿).
 * Между опорными точками суточная ставка интерполируется линейно,
 * за их пределами берётся ближайшая опорная ставка.
 */
export type PriceAnchors = Record<number, number>;

export const CAR_PRICE_ANCHORS: Record<string, PriceAnchors> = {
  // BMW X5: 50 000 ฿ за 7 дней и 160 000 ฿ за месяц — это цены уже со скидкой −20%,
  // поэтому здесь они записаны до скидки (÷ 0.8).
  'bmw-x5-2020': {
    7: 62_500,
    30: 200_000,
  },
};

export const getPriceAnchors = (carId?: string): PriceAnchors | undefined =>
  carId ? CAR_PRICE_ANCHORS[carId] : undefined;
