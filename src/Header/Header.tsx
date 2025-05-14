import styles from './Header.module.css'

function Header() {

    return(
        <header className={styles.header}>
            <div className={styles.brand}><a> Vocabulary Trainer </a></div>
            <ul className={styles.navList}>
                <li className={styles.navListElement}><a className={styles.navLink}> My Portfolio </a></li>
                <li className={styles.navListElement}><a className={styles.navLink}> Other Projects </a></li>
                <li className={styles.navListElement}><a className={styles.navLink}> c </a></li>
            </ul>
        </header>
    )
}

export default Header