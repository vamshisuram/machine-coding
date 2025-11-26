import './FileExplorer.css';

const data = {
    name: "root",
    type: "folder",
    children: [
        {
            name: "Documents",
            type: "folder",
            children: [
                { name: "resume.pdf", type: "file", size: "120KB" },
                { name: "project.docx", type: "file", size: "80KB" }
            ]
        },
        {
            name: "Pictures",
            type: "folder",
            children: [
                { name: "vacation.jpg", type: "file", size: "2MB" },
                { name: "profile.png", type: "file", size: "500KB" }
            ]
        },
        {
            name: "Music",
            type: "folder",
            children: [
                { name: "song.mp3", type: "file", size: "5MB" }
            ]
        },
        { name: "readme.txt", type: "file", size: "2KB" }
    ]
}


/**

Requirements ============================
file/folder view
onclick - expand show children
dot files show?
file icons?
directories diff look - expand icon
gutter - updated, modified, etc. 
indentation
ignored directories - dimmed
coloring of file / folder names
file click - callback
sync / async - folder data fetching ondemand
loading folder / data error handling? - lots of files (whole system)
if just one folder inside folder, compressed view showing expand on the child folder
expand all folders
contract all folders

Scope ============================
file/folder view
onclick - expand show children
indentation
expand all folders
contract all folders

HLD ============================
File Component - seems ok.. if more logic, we can start separating then.. no premature optimization
// but wrong impressions getting created.. it's ok to create separate - not losing much
Folder component
// just because it doesn't have children, doesn't mean it's file.. empty folder possible.
// also folder will have states, interactions.. lets separate

LLD ============================
Folder - name, children - based on type render differently
- isOpen state
- render name
- onClick handler - update isOpen
- show children isOpen
- className for folder block, and children block (for indent)

File - name, type

 */
import { useEffect, useState } from "react"

const status = {};

const File = ({name}) => <div>{name}</div>

const Folder = ({name, children, refresh}) => {
    const [isOpen, setIsOpen] = useState(status[name]);
    const handleClick = () => {
        setIsOpen(isOpen => {
            status[name] = !isOpen;
            return !isOpen;
        });
    }

    useEffect(() => {
        if (status[name] !== isOpen) {
            setIsOpen(status[name]);
        }
    }, [name, refresh, setIsOpen])

    return <div className="folder-container">
        <div className="folder-name" onClick={handleClick}>{name}</div>
        {isOpen && <div className="folder-children">
            {children.map(item => {
                if (item.type === 'folder') {
                    return <Folder {...item} key={item.name} refresh={refresh}/>
                } else {
                    return <File {...item} key={item.name}/>
                }
            })}
        </div>}
    </div>
}

export const FileExplorer = () => {
    const [refresh, setRefresh] = useState(0);
    const handleClick = (expandVal) => {
        // recursively data => add to status => true
        // false? recursively data => add to status => false
        function updateStatus(obj) {
            status[obj.name] = expandVal;
            if (obj.children) {
                for (let child of obj.children) {
                    updateStatus(child)
                }
            }
        }

        updateStatus(data, expandVal);
        setRefresh(refresh + 1);
    }
    return <div>
            <Folder {...data} refresh={refresh} />
            <button onClick={() => handleClick(true)}>ExpandAll</button>
            <button onClick={() => handleClick(false)}>ContractAll</button>
        </div>
}

