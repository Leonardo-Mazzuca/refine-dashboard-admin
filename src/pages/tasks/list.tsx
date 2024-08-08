import {
  KanbanBoard,
  KanBanBoardContainer,
  KanbanColumn,
  KanbanColumnSkeleton,
  KanbanItem,
  ProjectCardSkeleton,
} from "@/components";
import { KanbanAddCardButton } from "@/components/tasks/kanban/add-card-button";
import { ProjectCardMemo } from "@/components/tasks/kanban/card";
import { UPDATE_TASK_STAGE_MUTATION } from "@/graphql/mutations";
import { TASK_STAGES_QUERY, TASKS_QUERY } from "@/graphql/queries";
import { TaskStage } from "@/graphql/schema.types";
import { TasksQuery } from "@/graphql/types";
import { DragEndEvent } from "@dnd-kit/core";
import { useList, useNavigation, useUpdate } from "@refinedev/core";
import { GetFieldsFromList } from "@refinedev/nestjs-query";

import React from "react";

const TaskList = ({children}:React.PropsWithChildren) => {

  const {mutate:updateTask} = useUpdate()
  const {replace} = useNavigation()

  const {data:stages, isLoading:isLoadingStages} = useList<TaskStage>({
    resource:'taskStages',
    meta:{
        gqlQuery:TASK_STAGES_QUERY
    },
    filters: [
        {
            field:'title',
            operator:'in',
            value: ['TODO','IN PROGRESS','IN REVIEW','DONE']
        }
    ],
    sorters:[
        {
            field:'createdAt',
            order:'asc'
        }
    ],
 
  })
  const { data: tasks, isLoading: isLoadingTasks } = useList<GetFieldsFromList<TasksQuery>>({
    resource:'tasks',
    meta:{
        gqlQuery:TASKS_QUERY
    },
    sorters: [
        {
            field:'dueDate',
            order:'asc'
        }
    ],
    pagination:{
        mode:'off'
    },
    queryOptions:{
        enabled: !!stages
    }

  });

  const handleOnDragEnd = (event:DragEndEvent) => {
    let stageId = event.over?.id as undefined | string | null
    const taskId = event.active.id as string
    const taskStageId = event.active.data.current?.stageId

    if(taskStageId === stageId) {
        return
    } 
    
    if (stageId === 'unnasigned') {
        stageId = null
    }

    updateTask({
        resource:'tasks',
        id:taskId,
        values:{
            stageId:stageId
        },
        successNotification:false,
        mutationMode: 'optimistic',
        meta: {
            gqlMutation: UPDATE_TASK_STAGE_MUTATION
        }
    })
    
  }

  const taskStages = React.useMemo(()=>{

    if(!tasks?.data || !stages?.data) {
        return {
            unnasignedStage:[],
            stages: []
        }
    }

    const unnasignedStage = tasks.data.filter((task) => task.stageId === null)

    //@ts-ignore
    const grouped:TaskStage[] = stages.data.map((stage)=>({
        ...stage,
        tasks:tasks.data.filter((task)=>task.stageId?.toString() === stage.id)
    }))

    return {
        unnasignedStage,
        columns:grouped
    }



  },[stages,tasks])

  const handleAddCard = (args:{stageId:string}) => {
    const path = args.stageId === 'unnasigned'
    ? '/tasks/new'
    : `/tasks/new/stageId=${args.stageId}`

    replace(path)
  }

  const isLoading = isLoadingStages || isLoadingTasks
  
  if(isLoading){
    return <PageSkeleton />
  }

  return (
    <>
      <KanBanBoardContainer>
        <KanbanBoard onDragEnd ={handleOnDragEnd}>
          <KanbanColumn
            id="unnasigned"
            title={"unnasigned"}
            count={taskStages.unnasignedStage.length || 0}
            onAddClick={()=>handleAddCard({stageId:'unnasigned'})}
          >

            {taskStages.unnasignedStage.map((task)=> (
                <KanbanItem
                    key={task.id}
                    id={task.id}
                    data={{
                        ...task,
                        stageId:'unnasigned'
                    }}
                >

                    <ProjectCardMemo     
                        {...task}
                        dueDate={task.dueDate || undefined}
                    />  

                </KanbanItem>
            ))}


            {!taskStages.unnasignedStage.length && (

                <KanbanAddCardButton
                    onClick = {()=>handleAddCard({stageId:'unnasigned'})}
                 />
            )}
         
          </KanbanColumn>

          {taskStages.columns?.map((column)=>(
            <KanbanColumn
                key={column.id}
                id={column.id}
                title={column.title}
                count={column.tasks.length}
                onAddClick={()=>handleAddCard({stageId:column.id})}
            >
                {!isLoading &&
                
                    column.tasks.map(task => (
                        <KanbanItem data={task} key={task.id} id={task.id}>
                            <ProjectCardMemo
                             {...task} 
                             dueDate={task.dueDate || undefined}
                             />
                            
                        </KanbanItem>
                    ))
                }

                {!column.tasks.length &&
                    <KanbanAddCardButton
                     onClick = {()=>handleAddCard({stageId:column.id})}
                  />
                }
            </KanbanColumn>
          ))}
      
        </KanbanBoard>
      </KanBanBoardContainer>
      {children}
    </>
  );
};

export default TaskList;

const PageSkeleton = () => {
    const columnCount = 6;

    const cardCount = 4;


    return (
        <KanBanBoardContainer>
            {Array.from({length:columnCount}).map((_,index)=> (
                <KanbanColumnSkeleton key={index} >
                    {Array.from({length:cardCount}).map((_,index)=>(
                        <ProjectCardSkeleton
                            key={index}
                        />
                    ))}
                </KanbanColumnSkeleton>
            ))}
        </KanBanBoardContainer>
    )
}
