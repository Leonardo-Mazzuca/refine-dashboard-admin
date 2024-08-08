

import CustomAvatar from '@/components/custom-avatar';
import { Text } from '@/components/text';
import { COMPANIES_LIST_QUERY } from '@/graphql/queries';
import { Company } from '@/graphql/schema.types';
import { currencyNumber } from '@/utilities';
import { SearchOutlined } from '@ant-design/icons';
import { CreateButton, DeleteButton, EditButton, FilterDropdown, List, useTable } from '@refinedev/antd';
import { getDefaultFilter, useGo } from '@refinedev/core';
import { Input, Space, Table } from 'antd';


export const CompanyList = ({children}:React.PropsWithChildren) => {

  const go = useGo();

  const {tableProps,filters} = useTable({
    resource:'companies',
    onSearch: (values)=> ([{
      field:'name',
      operator:'contains',
      //@ts-ignore
      value:values.name
    }]),
    meta: {
      gqlQuery:COMPANIES_LIST_QUERY
    },
    pagination: {
      pageSize:20
    },
    sorters: {
      initial: [
        {
          field: 'createdAt',
          order:'desc'
        }
      ]
    },
    filters: {
      initial: [
        {
          field:'name',
          operator:'contains',
          value:undefined
        }
      ]
    }
  })

  return (

    <div>
        <List
          breadcrumb={false}
          headerButtons={()=>(
            <CreateButton
              onClick={()=>go({
                to:{
                  resource: 'companies',
                  action:'create'
                },
                options: {
                  keepQuery: true,
                },
                type:'replace'
              })}
            />
          )}
        >
    
          <Table
            {...tableProps}
            pagination={{...tableProps.pagination}}
          >
    
          <Table.Column<any>
              dataIndex='name'
              title="Company title"
              defaultFilteredValue={getDefaultFilter('id',filters)}
              filterIcon={<SearchOutlined />}
              filterDropdown={(props)=>(
                <FilterDropdown {...props} >
                  <Input 
                    placeholder='Search company'
                  />
                </FilterDropdown>
              )}
              render={(value,record)=> (
                <Space>
                  <CustomAvatar 
                    shape='square'
                    name={record.name}
                    src={record.avatarUrl}
                  />
                  <Text style={{
                    whiteSpace: 'nowrap'
                  }}>
                    {record.name}
                  </Text>
                </Space>
              )}
    
            />
    
            <Table.Column<any>
                dataIndex="totalRevenue"
                title="Open deals amount"
                render={(value,record)=>(
                  <Text>
                    
                    {currencyNumber(record?.dealsAggregate[0].sum?.value || 0)}
                  </Text>
                )}
    
              
    
    
            />  
    
            <Table.Column<any>
                dataIndex="id"
                title="Actions"
                fixed={'right'}
                render={(value)=>(
                    <Space>
                      <EditButton 
                        hideText
                        size='small'
                        recordItemId={value}
                      />
                      <DeleteButton 
                        hideText
                        size='small'
                        recordItemId={value}
                      />
                    </Space>
                )}  
    
              
    
    
            />  
    
         
          </Table>
    
    
    
        </List>
    
        {children}
        
      </div>
  );
}

