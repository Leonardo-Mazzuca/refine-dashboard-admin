



import { Avatar as AntdAvatar } from 'antd'
import { AvatarProps } from 'antd/lib'
import { getNameInitials } from '@/utilities'

type Props = AvatarProps & {
    name?:string
}

const CustomAvatar = ({name,style,...rest}:Props) => {


  return (
    <AntdAvatar
        alt='Macoco'
        size={'small'}
        style={{
            backgroundColor: '#87d068',
            display:'flex',
            alignItems:'center',
            border:'none',
            ...style
        }}
        {...rest}
    >
        {getNameInitials(name || '')}

    </AntdAvatar>
  )
}

export default CustomAvatar