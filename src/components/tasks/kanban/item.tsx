import { DragOverlay, useDraggable, UseDraggableArguments } from "@dnd-kit/core"


type Props = {
  id:string,
  data?:UseDraggableArguments['data']
}


const KanbanItem = ({children,id ,data}:React.PropsWithChildren<Props>) => {

  const {
    attributes, 
    listeners,
    setNodeRef
    ,active} = useDraggable({
      id,
      data
    })

  return (
    <div
      style={{
        position: 'relative',
      }}
    >
      <div 
      style={{
        opacity: active ? (active.id === id ? 1 : 0.5) : 1,
        borderRadius: '8px',
        position:'relative',
        cursor:'grab'
      }}
      {...listeners} 
      {...attributes} 
      ref={setNodeRef}
       >

        {active?.id === id && <DragOverlay zIndex={1000}>
            <div style={{
              borderRadius:'8px',
              boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
              cursor:'grabbing'
            }}>

              {children}      
            </div>
            
          </DragOverlay>
          }
        {children}      

            
      </div>
      
    </div>
  )
}

export default KanbanItem