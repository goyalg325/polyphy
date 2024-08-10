import {ExclamationTriangleIcon} from '@radix-ui/react-icons'
export const FormError = ({message}) => {
if(!message){
    return null ;
}
return(
    <div className='bg-red-500 p-3 rounded-md flex items-center gap-x-2 text-sm '>
        <ExclamationTriangleIcon className='h-4 w-4' />
        <p>{message}</p>
    </div>
)
}