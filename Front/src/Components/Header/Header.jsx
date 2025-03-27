import styles from './Header.module.css'
import back from '../../assets/backbtn.svg'
import Logo from '../../assets/logoPNG.png'

function Header() {
    return (
        <>
            <div className={styles.topBar}>
                <img src={Logo} />
            </div>
        </>
    )
}

export default Header