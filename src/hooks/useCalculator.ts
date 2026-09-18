import { useState, useEffect } from 'react';
import { CopyOption, CurrencyState, Part1State, Part2State } from '../types';

export function useCalculator() {
  const [currency, setCurrency] = useState<CurrencyState>({ cny: '', rate: '' });
  
  const [part1, setPart1] = useState<Part1State>({
    items: '', weight: '', price: '', priceCurrency: 'GBP',
    rateSea: '1.66', rateTruck: '2.77', rateAir: '5.44',
    activeSea: true, activeTruck: true, activeAir: true,
  });

  const [part2, setPart2] = useState<Part2State>({
    qty: '', rateSea: '', rateTruck: '', rateAir: '',
    activeSea: true, activeTruck: true, activeAir: true,
  });

  const [copyOrder, setCopyOrder] = useState<CopyOption[]>([
    's1', 's2', 't1', 't2', 'a1', 'a2'
  ]);

  const p1Items = parseFloat(part1.items) || 0;
  const p1Weight = parseFloat(part1.weight) || 0;
  const p1Price = parseFloat(part1.price) || 0;
  const p1RSea = parseFloat(part1.rateSea) || 0;
  const p1RTruck = parseFloat(part1.rateTruck) || 0;
  const p1RAir = parseFloat(part1.rateAir) || 0;

  const productTotal = p1Items * p1Price;
  const perItemSea = p1Items > 0 ? (productTotal + (p1Weight * p1RSea)) / p1Items : 0;
  const perItemTruck = p1Items > 0 ? (productTotal + (p1Weight * p1RTruck)) / p1Items : 0;
  const perItemAir = p1Items > 0 ? (productTotal + (p1Weight * p1RAir)) / p1Items : 0;

  const p2Qty = parseFloat(part2.qty) || 0;
  const p2RSea = parseFloat(part2.rateSea) || 0;
  const p2RTruck = parseFloat(part2.rateTruck) || 0;
  const p2RAir = parseFloat(part2.rateAir) || 0;

  const totalSea = p2Qty * p2RSea;
  const totalTruck = p2Qty * p2RTruck;
  const totalAir = p2Qty * p2RAir;

  useEffect(() => {
    setPart2(prev => ({
      ...prev,
      qty: part1.items,
      rateSea: part1.activeSea && p1Items > 0 ? perItemSea.toFixed(2) : '',
      rateTruck: part1.activeTruck && p1Items > 0 ? perItemTruck.toFixed(2) : '',
      rateAir: part1.activeAir && p1Items > 0 ? perItemAir.toFixed(2) : '',
      activeSea: part1.activeSea,
      activeTruck: part1.activeTruck,
      activeAir: part1.activeAir,
    }));
  }, [
    part1.items, part1.weight, part1.price,
    part1.rateSea, part1.rateTruck, part1.rateAir,
    part1.activeSea, part1.activeTruck, part1.activeAir,
    p1Items, perItemSea, perItemTruck, perItemAir
  ]);

  const updateCurrency = (field: keyof CurrencyState, value: string) => {
    setCurrency(prev => {
      const next = { ...prev, [field]: value };
      const c = parseFloat(next.cny) || 0;
      const r = parseFloat(next.rate) || 1;
      if (c > 0) {
        const gbp = c / r;
        setPart1(p1 => ({ ...p1, price: gbp.toFixed(4) }));
      }
      return next;
    });
  };

  const updatePart1 = (field: keyof Part1State, value: string | boolean) => {
    setPart1(prev => ({ ...prev, [field]: value }));
  };

  const updatePart2 = (field: keyof Part2State, value: string | boolean) => {
    setPart2(prev => ({ ...prev, [field]: value }));
  };

  const updateCopyOrder = (index: number, value: CopyOption) => {
    setCopyOrder(prev => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handlePastePart1 = (text: string) => {
    const cleanText = text.replace(/[^0-9.\s]/g, '');
    const values = cleanText.trim().split(/[\s]+/);
    if (values.length > 0 && values[0] !== '') {
      const pastedPrice = values[2];
      const isRmb = part1.priceCurrency === 'RMB';
      const rate = parseFloat(currency.rate) || 1;
      const gbpPrice = pastedPrice !== undefined && isRmb
        ? ((parseFloat(pastedPrice) || 0) / rate).toFixed(4)
        : pastedPrice;
      setPart1(prev => ({
        ...prev,
        items: values[0] !== undefined ? values[0] : prev.items,
        weight: values[1] !== undefined ? values[1] : prev.weight,
        price: gbpPrice !== undefined ? gbpPrice : prev.price,
      }));
      if (pastedPrice !== undefined) {
        setCurrency(c => ({ ...c, cny: isRmb ? pastedPrice : '' }));
      }
    }
  };

  const handlePastePart2 = (text: string) => {
    const cleanText = text.replace(/[^0-9.\s]/g, '');
    const values = cleanText.trim().split(/[\s]+/);
    if (values.length > 0 && values[0] !== '') {
      setPart2(prev => ({
        ...prev,
        qty: values[0] !== undefined ? values[0] : prev.qty,
        rateSea: values[1] !== undefined ? values[1] : prev.rateSea,
        rateTruck: values[2] !== undefined ? values[2] : prev.rateTruck,
        rateAir: values[3] !== undefined ? values[3] : prev.rateAir,
      }));
    }
  };

  const clearPart1 = () => {
    setCurrency({ cny: '', rate: '' });
    setPart1(prev => ({
      ...prev,
      items: '', weight: '', price: '', priceCurrency: 'GBP',
      rateSea: '1.66', rateTruck: '2.77', rateAir: '5.44',
      activeSea: true, activeTruck: true, activeAir: true,
    }));
  };

  const clearPart2 = () => {
    setPart2(prev => ({
      ...prev,
      qty: '', rateSea: '', rateTruck: '', rateAir: '',
      activeSea: true, activeTruck: true, activeAir: true,
    }));
  };

  const resetAll = () => {
    clearPart1();
    clearPart2();
  };

  return {
    state: { currency, part1, part2, copyOrder },
    derived: { perItemSea, perItemTruck, perItemAir, totalSea, totalTruck, totalAir },
    actions: {
      updateCurrency, updatePart1, updatePart2, updateCopyOrder,
      handlePastePart1, handlePastePart2, clearPart1, clearPart2, resetAll
    }
  };
}
