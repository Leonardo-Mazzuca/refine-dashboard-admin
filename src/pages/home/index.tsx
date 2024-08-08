import { Calendar, Col, Row } from "antd"

import { UpcomingEvents,DealsChart, DashboardTotalCardCount, LatestActivities } from "@/components"
import { useCustom } from "@refinedev/core"
import { DASHBOARD_TOTAL_COUNTS_QUERY } from "@/graphql/queries"
import { DashboardTotalCountsQuery } from "@/graphql/types"

export const Home = () => {

  const { data, isLoading} = useCustom<DashboardTotalCountsQuery>({
    url:'',
    method:'get',
    meta: {
      gqlQuery: DASHBOARD_TOTAL_COUNTS_QUERY
    }
  })
  return (
    <div>

      <Row gutter={[32,32]}>

        <Col 
           xl={8}
           sm={24}
           xs={24}
        >
          <DashboardTotalCardCount
          
            resource="companies"
            isLoading={isLoading}
            totalCount={data?.data.companies.totalCount}

          />
        
        </Col>
        <Col 
           xl={8}
           sm={24}
           xs={24}
        >
          <DashboardTotalCardCount 
          
          resource="contacts"
          isLoading={isLoading}
          totalCount={data?.data.contacts.totalCount}
          />
        
        </Col>
        <Col 
           xl={8}
           sm={24}
           xs={24}
        >
          <DashboardTotalCardCount 
          resource="deals"
          isLoading={isLoading}
          totalCount={data?.data.deals.totalCount}
          />

        </Col>

      </Row>
      <Row
        gutter={[32,32]}
        style={{
          marginTop:'32px'
        }}
      >

        <Col
          xl={8}
          sm={24}
          xs={24}
          style={{
            height:'460px'
          }}
        >
          <UpcomingEvents/>
        </Col>
        <Col
          xl={16}
          sm={24}
          xs={24}
          style={{
            height:'460px'
          }}
        >
          <DealsChart />
        </Col>

      </Row>

      <Row style={{marginTop:'32px'}} gutter={[32,32]}>

            <Col xs={24}>

              <LatestActivities />
            
            </Col>

      </Row>
    </div>
  )
}

