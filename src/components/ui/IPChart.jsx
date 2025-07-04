import React from 'react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';

const IPChart = ({ assets }) => {
  // Prepare data for charts
  const typeData = assets.reduce((acc, asset) => {
    acc[asset.type] = (acc[asset.type] || 0) + 1;
    return acc;
  }, {});

  const statusData = assets.reduce((acc, asset) => {
    const status = asset.status || 'active';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const pieOption = {
    title: {
      text: 'Assets by Type',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#374151'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'horizontal',
      bottom: '0%',
      left: 'center'
    },
    series: [
      {
        name: 'Asset Type',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: Object.entries(typeData).map(([type, count]) => ({
          value: count,
          name: type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' '),
          itemStyle: {
            color: {
              'patent': '#3b82f6',
              'trademark': '#10b981',
              'copyright': '#f59e0b',
              'trade-secret': '#8b5cf6'
            }[type] || '#6b7280'
          }
        }))
      }
    ]
  };

  const barOption = {
    title: {
      text: 'Assets by Status',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#374151'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: Object.keys(statusData).map(status => 
        status.charAt(0).toUpperCase() + status.slice(1)
      ),
      axisLine: {
        lineStyle: {
          color: '#d1d5db'
        }
      },
      axisTick: {
        lineStyle: {
          color: '#d1d5db'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#d1d5db'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#f3f4f6'
        }
      }
    },
    series: [
      {
        name: 'Count',
        type: 'bar',
        data: Object.values(statusData),
        itemStyle: {
          color: '#3b82f6',
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            color: '#2563eb'
          }
        }
      }
    ]
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-8 shadow-md border border-gray-100"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Portfolio Analytics</h2>
      
      {assets.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-80">
            <ReactECharts
              option={pieOption}
              style={{ height: '100%', width: '100%' }}
              opts={{ renderer: 'svg' }}
            />
          </div>
          <div className="h-80">
            <ReactECharts
              option={barOption}
              style={{ height: '100%', width: '100%' }}
              opts={{ renderer: 'svg' }}
            />
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
          <p className="text-gray-600">Add some IP assets to see analytics</p>
        </div>
      )}
    </motion.div>
  );
};

export default IPChart;