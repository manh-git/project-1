
const Content =({
    text
})=>
{
    return (
        <div dangerouslySetInnerHTML={{ __html: text }} className ="content"></div>

       
    )

}
export default Content;