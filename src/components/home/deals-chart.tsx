
import { DollarOutlined } from '@ant-design/icons'
import { Card } from 'antd'
import React from 'react'
import { Text } from '../text'
import { Area, AreaConfig } from '@ant-design/plots'
import { useList } from '@refinedev/core'
import { DASHBOARD_DEALS_CHART_QUERY } from '@/graphql/queries'
import { mapDealsData } from '@/utilities/helpers'
import { GetFieldsFromList } from '@refinedev/nestjs-query'
import {DashboardDealsChartQuery} from '@/graphql/types'

const DealsChart = () => {

  const {
    data,isLoading
  } = useList<GetFieldsFromList<DashboardDealsChartQuery>>({
    resource:'dealStages',
    meta: {
      gqlQuery: DASHBOARD_DEALS_CHART_QUERY
    },
    filters: [
      {
        field:'title',
        operator:'in',
        value: ['WON','LOST']
      }
    ]
  })

  
  const dealData = React.useMemo(()=>{
    return mapDealsData(data?.data)
  },[data?.data]);

  const config:AreaConfig = {
    data: dealData,
    xField:'timeText',
    yField:'value',
    isStack: false,
    seriesField: 'state',
    animation:true,
    startOnZero:false,
    smooth: true,
    legend:{
      offsetY: -6
    },
    yAxis: {
      tickCount: 4,
      label: {
        formatter: (v:string) => {
            return `$${Number(v)/1000}k`
        },
      }
    },
    tooltip: {
      formatter: (data) => {
        return {
          name:data.state,
          value: `$${Number(data.value)/1000}k`
        }
      }
    }
  };

  return (

      <Card
        style={{
          height:'100%'
        }}
        title={
          <div style={{
            display:'flex',
            alignItems:'center',
            gap:'8px'
          }}>
            <DollarOutlined />
            <Text style={{marginLeft:'0.5rem'}} size='sm'>

              Deals

            </Text>
          </div>
        }
        headStyle={{padding:'8px 16px'}}
        bodyStyle={{padding:'24px 24px 0 24px'}}
      >


        <Area
          {...config}
          height={325}
        />
      </Card>


  )

}

export default DealsChart