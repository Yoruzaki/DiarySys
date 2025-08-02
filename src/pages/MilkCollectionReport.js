import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { format, parseISO } from 'date-fns';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 25,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#3498db',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    flex: 1,
    paddingRight: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 3,
  },
  reportInfo: {
    marginBottom: 20,
    fontSize: 10,
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#dee2e6',
    marginBottom: 25,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#3498db',
    color: 'white',
  },
  tableCol: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCellHeader: {
    margin: 8,
    fontSize: 10,
    fontWeight: 'bold',
  },
  tableCell: {
    margin: 8,
    fontSize: 10,
    color: '#495057',
  },
  summary: {
    marginTop: 20,
    fontSize: 12,
    backgroundColor: '#e8f4fc',
    padding: 15,
    borderRadius: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2c3e50',
  },
  summaryItem: {
    marginBottom: 5,
  },
  logo: {
    width: 80,
    height: 80,
    objectFit: 'contain',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 9,
    color: '#95a5a6',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  evenRow: {
    backgroundColor: '#f8f9fa',
  },
  oddRow: {
    backgroundColor: 'white',
  },
});

// Calculate summary data
const calculateSummary = (data) => {
  const totalQuantity = data.reduce((sum, item) => sum + parseFloat(item.quantity || 0), 0);
  const avgFat = data.reduce((sum, item) => sum + parseFloat(item.fat_content || 0), 0) / data.length;
  const avgTemp = data.reduce((sum, item) => sum + parseFloat(item.temperature || 0), 0) / data.length;
  
  return {
    totalQuantity: totalQuantity.toFixed(2),
    avgFat: avgFat.toFixed(2),
    avgTemp: avgTemp.toFixed(2),
    totalCollections: data.length,
  };
};

// Create Document Component
const MilkCollectionReport = ({ data, params }) => {
  const summary = calculateSummary(data);
  const startDate = format(new Date(params.startDate), 'MMMM dd, yyyy');
  const endDate = format(new Date(params.endDate), 'MMMM dd, yyyy');
  const dateRange = params.startDate === params.endDate 
    ? startDate 
    : `${startDate} to ${endDate}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Milk Collection Report</Text>
            <Text style={styles.subtitle}>{dateRange}</Text>
            <Text style={styles.subtitle}>
              Generated on: {format(new Date(), 'MMMM dd, yyyy HH:mm')}
            </Text>
          </View>
          {/* Replace with your actual logo path */}
          <Image 
            style={styles.logo} 
            src="..\images\massinissa-logo.png" // Replace with your logo URL
          />
        </View>

        <View style={styles.reportInfo}>
          <Text>Report Period: {params.period.charAt(0).toUpperCase() + params.period.slice(1)}</Text>
          {params.supplierId !== 'all' && (
            <Text>Supplier: {data[0]?.supplier_name || 'Selected supplier'}</Text>
          )}
          <Text>Total Records: {data.length}</Text>
        </View>

        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, { width: '20%' }]}>
              <Text style={styles.tableCellHeader}>Date</Text>
            </View>
            <View style={[styles.tableColHeader, { width: '25%' }]}>
              <Text style={styles.tableCellHeader}>Supplier</Text>
            </View>
            <View style={[styles.tableColHeader, { width: '15%' }]}>
              <Text style={styles.tableCellHeader}>Quantity (L)</Text>
            </View>
            <View style={[styles.tableColHeader, { width: '15%' }]}>
              <Text style={styles.tableCellHeader}>Fat (%)</Text>
            </View>
            <View style={[styles.tableColHeader, { width: '15%' }]}>
              <Text style={styles.tableCellHeader}>Temp (°C)</Text>
            </View>
            <View style={[styles.tableColHeader, { width: '10%' }]}>
              <Text style={styles.tableCellHeader}>pH</Text>
            </View>
          </View>

          {/* Table Rows */}
          {data.map((item, index) => (
            <View 
              key={index} 
              style={[
                styles.tableRow,
                index % 2 === 0 ? styles.evenRow : styles.oddRow
              ]}
            >
              <View style={[styles.tableCol, { width: '20%' }]}>
                <Text style={styles.tableCell}>
                  {format(parseISO(item.collection_date), 'MMM dd, yyyy')}
                </Text>
              </View>
              <View style={[styles.tableCol, { width: '25%' }]}>
                <Text style={styles.tableCell}>{item.supplier_name}</Text>
              </View>
              <View style={[styles.tableCol, { width: '15%' }]}>
                <Text style={styles.tableCell}>{item.quantity}</Text>
              </View>
              <View style={[styles.tableCol, { width: '15%' }]}>
                <Text style={styles.tableCell}>{item.fat_content || '-'}</Text>
              </View>
              <View style={[styles.tableCol, { width: '15%' }]}>
                <Text style={styles.tableCell}>{item.temperature || '-'}</Text>
              </View>
              <View style={[styles.tableCol, { width: '10%' }]}>
                <Text style={styles.tableCell}>{item.ph || '-'}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Summary Statistics</Text>
          <Text style={styles.summaryItem}>- Total Collections: {summary.totalCollections}</Text>
          <Text style={styles.summaryItem}>- Total Quantity Collected: {summary.totalQuantity} Liters</Text>
          <Text style={styles.summaryItem}>- Average Fat Content: {summary.avgFat}%</Text>
          <Text style={styles.summaryItem}>- Average Temperature: {summary.avgTemp}°C</Text>
        </View>

        <View style={styles.footer}>
          <Text>Dairy Management System • {format(new Date(), 'yyyy')}</Text>
          <Text>Confidential - For internal use only</Text>
        </View>
      </Page>
    </Document>
  );
};

export default MilkCollectionReport;