import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

// PDF Export
export const exportToPDF = (transactions) => {
  const doc = new jsPDF();
  
  doc.setFontSize(16);
  doc.text('Finansal Hareket Raporu', 14, 15);
  doc.setFontSize(10);
  doc.text(`Tarih: ${new Date().toLocaleDateString('tr-TR')}`, 14, 22);

  const tableRows = transactions.map((t) => [
    new Date(t.date).toLocaleDateString('tr-TR'),
    t.Category?.name || 'Genel',
    t.Category?.type === 'income' ? 'Gelir' : 'Gider',
    t.description || '-',
    `${Number(t.amount).toLocaleString('tr-TR')} TL`
  ]);

  doc.autoTable({
    startY: 28,
    head: [['Tarih', 'Kategori', 'Tip', 'Açıklama', 'Tutar']],
    body: tableRows,
    theme: 'striped',
    headStyles: { fillColor: [37, 99, 235] },
  });

  doc.save(`finans-raporu-${Date.now()}.pdf`);
};

// Excel Export
export const exportToExcel = (transactions) => {
  const formattedData = transactions.map((t) => ({
    Tarih: new Date(t.date).toLocaleDateString('tr-TR'),
    Kategori: t.Category?.name || 'Genel',
    Tip: t.Category?.type === 'income' ? 'Gelir' : 'Gider',
    Açıklama: t.description || '-',
    Tutar: Number(t.amount)
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'İşlemler');

  XLSX.writeFile(workbook, `finans-raporu-${Date.now()}.xlsx`);
};
