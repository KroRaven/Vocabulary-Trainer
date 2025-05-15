/* Dependencies */
import styles from './Main.module.css'
import { useState, useEffect } from 'react';



/* Sub Element: Display of each VocabList from the localStorage */
function VocabListsDisplayElement(props: any) {  // props. | name, funcDelete, funcLoad
    return(
        <li className={styles.vocabListsElement} key={props.name}>
            <p className={styles.vocabListsName}> {props.name} </p>
            <div className={styles.vocabListsEditButtonWrap}>
                <button className={styles.vocabListsEditButton} onClick={ () => props.funcLoad(props.name)} > Load </button>
                <button className={styles.vocabListsEditButton} onClick={ () => props.funcDelete(props.name)} > Delete </button>
                {/*<button className={styles.vocabListsEditButton} onClick={ () => props.funcDelete(props.name)} > Rename </button>*/}
            </div>
        </li>
    )
}

/* Sub Element: Display of each Vocab from the current VocabList  */
function VocabDisplayElement(props: any) {  // props. | name, funcDelete
    const uniqueKey = props.vocab.reduce( (acc: string, cur: string) => acc+cur)
    return(
        <li className={styles.vocabElement} key={uniqueKey}>
            <p className={styles.vocabText}> {props.vocab[0]} </p>
            <p className={styles.vocabText}> {props.vocab[1]} </p>
            <button className={styles.vocabListsEditButton} onClick={ () => props.funcDelete(props.vocab)}> Delete </button>
        </li>
    )
}





/* Main Element */
function Main() {
    // States of Vocabulary
    const [vocabListStorage, setVocabListStorage] = useState({...localStorage});
    const [currVocabList, setCurrVocabList] = useState({"name": "name", "vocabs": [["word","vocab"]]});  
    const [currVocab, setCurrVocab] = useState(["", ""]); 
    // States of User Inputs
    const [prompt, setPrompt] = useState("");           // The Guessed Translation which the User prompts in
    const [status, setStatus] = useState("default")     // Status of the Prompt being Wrong or Right
    const [name, setName] = useState("");               // Name of the Create New VocabList 
    const [word, setWord] = useState("");               // Word to add into VocabList
    const [translation, setTranslation] = useState(""); // Translation to add into VocabList
    // Functions that detect Input Changes
    function handlePromptChange(e: any){e.preventDefault(); setPrompt(e.target.value);}
    function handleNameChange(e: any){e.preventDefault(); setName(e.target.value);}
    function handleWordChange(e: any){e.preventDefault(); setWord(e.target.value);}
    function handleTranslationChange(e: any){e.preventDefault(); setTranslation(e.target.value);}



    // Functions that Handle User Button Presses
    function handleSubmit(){
        // Checks if the User Prompt is Correct
        (prompt == currVocab[1]) ? setStatus("green") : setStatus("red");
    }
    function handleNext(){
        // RANDOMLY picks another Vocab from the VocabList
        const randomIndex: number = Math.floor(Math.random() * currVocabList.vocabs.length); // Random Index
        setCurrVocab(currVocabList.vocabs[randomIndex]);
        setStatus("white");
        (document.getElementById("promptInput") as HTMLInputElement).value = "";
    }
    function handleCreate(){
        // Creates new VocabList 
        const newVocabListName: string = name;
        const newVocabListVocabs: string[][] = [];
        setCurrVocabList({"name": newVocabListName, "vocabs": newVocabListVocabs});
        setCurrVocab([]);
        (document.getElementById("nameInput") as HTMLInputElement).value = "";
    }
    function handleDelete(name: string){
        // Deletes selected VocabList
        localStorage.removeItem(name);
        setVocabListStorage( {...localStorage} );
    }
    function handleLoad(name: string){
        // Loads selected VocabList, and Delcares it as Current VocabList
        const loadedVocabList = JSON.parse(localStorage.getItem(name)!);
        setCurrVocabList( loadedVocabList );
        setCurrVocab([]);
    }
    function handleAddVocab(){
        // Adds a Vocab to the VocabList
        const addedVocab = [word, translation];
        const newVocabs = [...currVocabList.vocabs, addedVocab];
        setCurrVocabList({...currVocabList, "vocabs": newVocabs});
        (document.getElementById("wordInput") as HTMLInputElement).value = "";
        (document.getElementById("translationInput") as HTMLInputElement).value = "";
    }
    function handleDeleteVocab(vocab: string[]){
        // Deletes a Vocab to the VocabList
        const deletedVocab = vocab;
        const oldVocabs = currVocabList.vocabs;
        const newVocabs = oldVocabs.filter( (voc) => voc[0] !== deletedVocab[0] && voc[1] !== deletedVocab[1] );
        setCurrVocabList({...currVocabList, "vocabs": newVocabs})
    }
    // Autosaves the current VocabList into the localStorage
    useEffect( () => {
        localStorage.setItem(currVocabList.name, JSON.stringify(currVocabList));
        setVocabListStorage({...localStorage})
    }, [currVocabList])




    // Renders the VocabLists saved in localStorage as well as the Vocabs from the current VocabList
    let allVocabLists = Object.keys(vocabListStorage).map( 
        (name) => <VocabListsDisplayElement name={name} funcDelete={handleDelete} funcLoad={handleLoad} />
        );
    let allVocabs = currVocabList.vocabs.map( 
        (voc) => <VocabDisplayElement vocab={voc} funcDelete={handleDeleteVocab} /> 
        );

    // Dynamic Style for the Prompt Input
    const inputColor = {
        color: status
    }

    



    /* MAIN COMPONENT */
    return(
        <main className={styles.main}>
           <section className={styles.trainSection}>
                <h1 className={styles.headerText}>Current Vocabulary List: <span className={styles.currVocabListHighlight}> {currVocabList.name} </span></h1>
                <output className={styles.currVocabDisplay}>{currVocab[0] ? currVocab[0] : "Here will be the Word"}</output>
                <input className={styles.inputText} id="promptInput" style={inputColor} onChange={handlePromptChange} onKeyDown={  (e:any) => { if(e.key === "Enter"){handleSubmit()} else if(e.key === "ArrowRight"){handleNext()} }  } type="text" />
                <div className={styles.buttonWrap}>
                    <button className={styles.btnTrain} onClick={handleSubmit}>Submit</button>
                    <button className={styles.btnTrain} onClick={handleNext}>Next</button>
                </div>
           </section>

           <section className={styles.vocabListsSection}>
                <h1 className={styles.headerText}> Vocabulary Lists </h1>
                <div className={styles.nameInputWrap}>
                    <input className={styles.nameInput} id="nameInput" onChange={handleNameChange} onKeyDown={  (e:any) => { if(e.key === "Enter"){handleCreate()} }  } type="text"  />
                    <button  className={styles.btnCreate} onClick={handleCreate} > Create </button>
                </div>
                <ul className={styles.vocabListsDisplay}>
                    {allVocabLists}
                </ul>
           </section>

           <section className={styles.vocabsSection}>
                <h1 className={styles.headerText}> Vocabulary </h1>
                <div className={styles.vocabInputWrap}>
                    <input className={styles.vocabInput} id="wordInput" onChange={handleWordChange} onKeyDown={  (e:any) => { if(e.key === "Enter"){handleAddVocab()} }  } type="text" />
                    <input className={styles.vocabInput} id="translationInput" onChange={handleTranslationChange} onKeyDown={  (e:any) => { if(e.key === "Enter"){handleAddVocab()} }  } type="text"  />
                    <button className={styles.btnAdd} onClick={handleAddVocab}> Add </button>
                </div>
                <details className={styles.vocabsExpandable}>
                    <summary className={styles.vocabsSummary}> Vocabs </summary>
                    <ul className={styles.vocabsDisplay}>
                        {allVocabs}
                    </ul>
                </details>
           </section>
        </main>
    )
}

export default Main