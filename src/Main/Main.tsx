import styles from './Main.module.css'
import { useState, useEffect } from 'react';

/* Sub Element */
function VocabListsDisplayElement(props: any) {  // props. | name, funcDelete, funcLoad

    return(
        <li key={props.name}>
            {props.name}
            <button onClick={ () => props.funcLoad(props.name)} className={styles.button +" "}> Load </button>
            <button onClick={ () => props.funcDelete(props.name)} className={styles.button +" "}> Delete </button>
            <button onClick={ () => props.funcDelete(props.name)} className={styles.button +" "}> Rename </button>
        </li>
    )
}

/* Sub Element */
function VocabDisplayElement(props: any) {  // props. | name, funcDelete, funcLoad
    const uniqueKey = props.vocab.reduce( (acc: string, cur: string) => acc+cur)

    return(
        <li key={uniqueKey}>
            {props.vocab[0]} / {props.vocab[1]}
            <button onClick={ () => props.funcDelete(props.vocab)}> Delete </button>
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
        console.log("yup");
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
        // Loads selected VocabList
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
    let allVocabLists = Object.keys(vocabListStorage).map( (name) => <VocabListsDisplayElement name={name} funcDelete={handleDelete} funcLoad={handleLoad} />);
    let allVocabs = currVocabList.vocabs.map( (voc) => <VocabDisplayElement vocab={voc} funcDelete={handleDeleteVocab} /> );

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
                <input id="promptInput" className={styles.inputText} style={inputColor} onChange={handlePromptChange} onKeyDown={ (e) => {if(e.key == "Enter"){handleSubmit}} } type="text" />
                <div className={styles.buttonWrap}>
                    <button className={styles.button +" "+ styles.btnTrain} onClick={handleSubmit}>Submit</button>
                    <button className={styles.button +" "+ styles.btnTrain} onClick={handleNext}>Next</button>
                </div>
           </section>

           <section className={styles.vocabListsSection}>
                <h1 className={styles.headerText}> Your Vocabulary Lists</h1>
                <div className={styles.nameInputWrap}>
                    <input id="nameInput" onChange={handleNameChange} type="text" className={styles.textInput +" "+ styles.nameInput}  />
                    <button onClick={handleCreate} className={styles.button +" "+ styles.btnCreate}> Create </button>
                </div>
                <ul>
                    {allVocabLists}
                </ul>
           </section>

           <section className={styles.vocabsSection}>
                <h1 className={styles.headerText}> Your Vocabulary </h1>
                <input id="wordInput" onChange={handleWordChange} type="text" />
                <input id="translationInput" onChange={handleTranslationChange} type="text" />
                <button onClick={handleAddVocab}> Add </button>
                <ul>
                    {allVocabs}
                </ul>
           </section>
        </main>
    )
}

export default Main