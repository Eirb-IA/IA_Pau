import { Fragment, FunctionalComponent, h } from 'preact';
import style from './style.css';
import { useState, useEffect } from "preact/hooks";
import Button from '../../components/Button/button';
import { PreactAdapter } from 'enzyme-adapter-preact-pure';

const serverAddress = "http://localhost:8080";


interface TreatmentResponse {
    trashes:{
      x:number, //bbox origin x 
      y:number, //bbox origin y
      w:number, //bbox width
      h:number, //bbox height
      classes:{
        name:string, // The name of the class.
        prob:number  // The probability that the image is this class.
      }[]
    }[]
}


const Home: FunctionalComponent = () => {
    const [img, setImg] = useState<string>("");
    const [filename, setFilename] = useState<string>("none");
    const [boxes, setBoxes] = useState<TreatmentResponse|null>(null);

    useEffect(()=> {
        fetch(serverAddress, {
            method:"GET"
        }).then((res)=>{
            if(res.status === 200){
                return res.json();
            }
        }).then((obj)=>{
            console.log(obj);
        });

        setBoxes({
            trashes:[
                {
                    x:12,
                    y:25,
                    w:100,
                    h:100,
                    classes:[]
                },
            ]
        });
    },[]); 

    const handleClickOnUploadImage = () => {
        console.log("Upload file.");
        let input = document.createElement('input');
        input.type = 'file';
        input.click();
        input.onchange = (e:Event) => {
            let file = (e.target as unknown as any).files[0]; 
            console.log(file.name);
            setImg(URL.createObjectURL(file));
            setFilename(file.name);
            var formdata = new FormData();
            formdata.append("file", file);
            formdata.append("filename", file.name);
            let metaTMP = localStorage.getItem("CURR_STR_META");
            if (metaTMP) formdata.append("meta", metaTMP);
            fetch(`${serverAddress}/upload/image`, {
                method: "POST",
                body: formdata
            }).then((res)=>{
                console.log(res.status);
                return res.json();
            }).then((obj)=>{
                setBoxes(obj);
            });
        }
    }


    const renderClasses = (boxes:TreatmentResponse|null) => {
        if(boxes === null || boxes.trashes.length === 0) return "";
        let i = -1;
        return boxes.trashes[0].classes.map((class_useless)=>{
            i += 1;
            return (
                <tr>
                    {boxes.trashes.map((trash)=>{
                        return (
                            <td style={{color:"#eee"}}>{trash.classes[i].name} : {trash.classes[i].prob}</td>
                        )
                    })}
                </tr>
            )
        })
    }

    return (
        <div class={style.home}>
            <div class={style.leftPanel}>
                <p class={style.title}>Image</p>
                <div class={style.imageContainer}>
                    <img
                        id="img-id"
                        class={style.image}
                        src={img} 
                    />
                    {boxes === null ? "" : (
                        boxes.trashes.map((trash, index)=>{
                            return (
                                <Fragment>
                                    <div style={{position:"absolute", top:`${trash.y}px`, left:`${trash.x}px`, width:`${trash.w}px`, height:`${trash.h}px`, borderStyle:"solid",borderWidth:"2px", borderColor:"#0000FF"}}/>
                                    <p style={{padding:"0px", margin:"0px", background:"#000", position:"absolute", top:`${trash.y + trash.h - 2}px`, left:`${trash.x}px`, borderStyle:"solid",borderWidth:"2px", borderColor:"#0000FF"}}>Trash #{index+1}</p>
                                </Fragment>
                            
                            )
                        })
                    )}

                </div>
            </div>
            <div class={style.rightPanel}>
                <p style={{display:"flex", margin:"0px", padding:"0px"}}>Upload image :</p>
                <div style={{display:"flex", flexDirection:"row", alignItems:"center", marginTop:"1rem", marginLeft:"1rem"}}>
                    <Button style={{}} text="Choose an image" onClick={handleClickOnUploadImage}/>
                    <p class={style.filename}>{filename}</p>
                </div>
                <p style={{display:"flex", margin:"0px", padding:"0px", marginTop:"1rem"}}>Objects :</p>
                <div style={{overflow:"auto", marginTop:"1rem"}}>
                    <table style={{borderRadius:"7px", borderStyle:"solid", borderColor:"#5555ff77", borderWidth:"1px", marginLeft:"1rem"}}>
                        <thead style={{color:"#eee"}}>
                            {boxes === null ? "" : (
                                boxes.trashes.map((boxe, index)=>{
                                    return (
                                        <th style={{minWidth:"120px", background:"#00000055"}}>Trash #{index+1}</th>
                                    );
                                })    
                            )}
                        </thead>
                            {/* {boxes === null ? "" : (
                                boxes.trashes.map((boxe, index)=>{
                                    return (
                                        <th style={{minWidth:"100px", background:"#00000055"}}>Trash #{index+1}</th>
                                    );
                                })    
                            )} */}
                            {boxes === null ? "" : renderClasses(boxes)}
                    </table>

                </div>
            </div>
        </div>
    );
};

export default Home;
