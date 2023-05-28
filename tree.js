'use strict';

let treeData = [
    {
        id: 1,
        parent_id: null,
        type: 'folder',
        name: 'Folder 1',
        folder_data: [],
    },
    {
        id: 2,
        parent_id: null,
        type: 'folder',
        name: 'Совершенно новая папка с длинным названием',
        folder_data: [
            {
                id: 3,
                parent_id: 2,
                nested: 1,
                type: 'file',
                name: 'File 1',
                text: 'Some text here.',
            },
            {
                id: 4,
                parent_id: 2,
                nested: 1,
                type: 'file',
                name: 'File 2',
                text: 'Whats a beautiful article!',
            },
        ],
    },
    {
        id: 5,
        parent_id: null,
        type: 'folder',
        name: 'Folder 3',
        folder_data: [
            {
                id: 6,
                parent_id: 5,
                nested: 1,
                type: 'file',
                name: 'File 1',
                text: 'File number one!',
            },
            {
                id: 7,
                parent_id: 5,
                nested: 1,
                type: 'file',
                name: 'File 2',
                text: 'And file number two!',
            },
        ],
    },
    {
        id: 11,
        parent_id: null,
        type: 'file',
        name: 'File 1',
        text: '',
    },
    {
        id: 12,
        parent_id: null,
        type: 'file',
        name: 'File 2',
        text: 'Some text here.',
    },
    {
        id: 13,
        parent_id: null,
        type: 'file',
        name: 'File 3',
        text: '',
    },
    {
        id: 14,
        parent_id: null,
        type: 'folder',
        name: 'Folder 3',
        folder_data: [
            {
                id: 15,
                parent_id: 5,
                nested: 1,
                type: 'file',
                name: 'File 1',
                text: 'File number one!',
            },
            {
                id: 16,
                parent_id: 5,
                nested: 1,
                type: 'file',
                name: 'File 2',
                text: 'And file number two!',
            },
        ],
    },
    {
        id: 17,
        parent_id: null,
        type: 'folder',
        name: 'Folder 3',
        folder_data: [
            {
                id: 18,
                parent_id: 5,
                nested: 1,
                type: 'file',
                name: 'File 1',
                text: 'File number one!',
            },
            {
                id: 19,
                parent_id: 5,
                nested: 1,
                type: 'file',
                name: 'File 2',
                text: 'And file number two!',
            },
        ],
    },
];

class Tree {
    constructor(config) {
        this.config = config;
        this.DOM_tree = document.getElementById(this.config.main.treeId);
        this.isFilePreview = false;
        this.renameEditMode = false;
    }

    data(treeData) {
        this.data = treeData;
    }

    withMarkdownEditor(mde) {
        this.isFilePreview = true;
        this.mde = mde;

    }

    init() {
        this.createTreeNodes(this.data);
        this.paddingTreeNodes();
        this.folderClickEvent();
        this.hideFolderElements();
        this.createContextMenu();
        this.setActiveListener();
        this.createContextMenuButtonsEvent();
        this.createContextMenuEvent();
        this.disableRightClick();

        if (this.isFilePreview === true) {
            this.filePreviewEnable();
        }
    }

    createContextMenuButtonsEvent() {
        const self = this;
        const createFile = document.querySelector('#create-file').closest('.context-element');
        const rename = document.querySelector('#rename').closest('.context-element');

        rename.addEventListener('click', function (event) {
            self.DOM_context_menu.style.display = 'none';

            const text = self.DOM_context_menu_element.querySelector('span');
            text.contentEditable = 'true';
            text.style.border = 'solid 1px gray';
            text.focus();
            text.style.cursor = 'text';
            self.renameEditMode = true;

            const DOM_div_folders = self.DOM_tree.querySelectorAll('div [data-type=\'file\']');

            DOM_div_folders.forEach(function (element) {
                element.classList.remove('active');
            })

            document.addEventListener('keydown', (e) => {
                switch (e.key) {
                    case 'Enter': {
                        self.renameFile(text);
                        self.hideTextRename(text);
                        break;
                    }
                    case 'Escape': {
                        self.hideTextRename(text);
                        break;
                    }
                }
            });
        });

        createFile.addEventListener('click', function (event) {

        });
    }

    renameFile() {
        const self = this;
        const selectedId = parseInt(self.DOM_context_menu_element.dataset.id);
        const newName = self.DOM_context_menu_element.innerText;

        // server request for renaming
    }

    renameElementFromDataById(id, newName, data) {
        const self = this;

        data.forEach(function (file) {
            if (file.id === id) {
                file.name = newName;
            }

            if (typeof file.folder_data === 'object'
                && file.folder_data.length !== 0
            ) {
                self.renameElementFromDataById(id, file.folder_data);
            }
        })

        return null;
    }

    hideTextRename(text) {
        const self = this;
        self.renameEditMode = false;
        text.contentEditable = 'false';
        text.style.border = 'none';
        text.style.padding = '0';
        text.style.cursor = 'pointer';
    }

    disableRightClick() {
        document.addEventListener('contextmenu', function (event) {
            if (event.target.closest('#tree') !== null) {
                event.preventDefault();
            }
        });
    }

    createContextMenuEvent() {
        const self = this;
        const DOM_div_folders = this.DOM_tree.querySelectorAll('div');
        self.DOM_context_menu = document.getElementById('context-menu');

        DOM_div_folders.forEach(function (divElement) {
            divElement.addEventListener('mousedown', function (event) {
                if (event.which === 3) { // right click
                    self.DOM_context_menu.style.display = 'flex';

                    const percentageX = ((event.x / (document.documentElement.scrollWidth - divElement.style.width) * 100)).toFixed(0);
                    const percentageY = ((event.y / (document.documentElement.scrollHeight - divElement.style.height) * 100)).toFixed(0);

                    self.DOM_context_menu_element = divElement;

                    self.DOM_context_menu.style.top = percentageY + '%';
                    self.DOM_context_menu.style.left = percentageX + '%';
                }
            });
        });

        document.addEventListener('click', function (event) {
            if (self.DOM_context_menu.style.display === 'none') {
                return;
            }

            if (event.target.closest('#context-menu') === null) {
                self.DOM_context_menu.style.display = 'none';
            }
        });
    }

    filePreviewEnable() {
        const self = this;
        const DOM_div_folders = this.DOM_tree.querySelectorAll('div [data-type=\'file\']');

        DOM_div_folders.forEach(function (divElement) {
            divElement.addEventListener('click', function (event) {
                const fileId = divElement.dataset.id;

                self.setFileTextById(fileId, self.data);

                if (self.fileText === '') {
                    self.fileText = 'Проба пера...';
                }

                if (self.renameEditMode === false)
                    self.mde.value(self.fileText);
            });
        });
    }

    setFileTextById(fileId, data) {
        const self = this;

        data.forEach(function (file) {
            // main code
            if (file.id === parseInt(fileId)) {
                self.fileText = file.text;
            }

            // recursion
            if (typeof file.folder_data === 'object'
                && file.folder_data.length !== 0
            ) {
                self.setFileTextById(fileId, file.folder_data);
            }
        });
    }

    setActiveListener() {
        const self = this;
        const DOM_div_folders = this.DOM_tree.querySelectorAll('div [data-type=\'file\']');

        DOM_div_folders.forEach(function (divElement) {
            divElement.addEventListener('click', function (event) {
                DOM_div_folders.forEach(function (element) {
                    element.classList.remove('active');
                })

                if (self.renameEditMode === false) {
                    divElement.classList.add('active');
                }
            });
        })
    }

    hideFolderElements() {
        const self = this;
        const DOM_div_folders = this.DOM_tree.querySelectorAll('[data-type=\'folder\']');

        DOM_div_folders.forEach(function (divElement) {
            if (self.config.main.hideFolders) {
                self.hideFolderSubElements(divElement);
            }
        })
    }

    folderClickEvent() {
        const self = this;
        const DOM_div_folders = this.DOM_tree.querySelectorAll('[data-type=\'folder\']');

        DOM_div_folders.forEach(function (divElement) {
            divElement.addEventListener('click', function () {
                if (self.renameEditMode === false)
                    self.folderClickBehaviour(divElement);
            });
        })
    }

    folderClickBehaviour(divChildElement) {
        const self = this;

        self.hideFolderSubElements(divChildElement);
        self.switchCaretImg(divChildElement);
        self.switchFolderImg(divChildElement);
    }

    switchCaretImg(divChildElement) {
        const self = this;
        const DOM_parent_folder = divChildElement.closest('ul');
        const DOM_img_caret = DOM_parent_folder.querySelector('#caret');

        if (DOM_img_caret.dataset.isOpened === 'true') {
            DOM_img_caret.src = self.config.style.caret_closed;
            DOM_img_caret.dataset.isOpened = 'false';
        } else {
            DOM_img_caret.src = self.config.style.caret_opened;
            DOM_img_caret.dataset.isOpened = 'true';
        }
    }

    switchFolderImg(divChildElement) {
        const self = this;
        const DOM_parent_folder = divChildElement.closest('ul');
        const DOM_img_folder = DOM_parent_folder.querySelector('#folder');

        if (DOM_img_folder.dataset.isOpened === 'true') {
            DOM_img_folder.src = self.config.style.folder_closed;
            DOM_img_folder.dataset.isOpened = 'false';
        } else {
            DOM_img_folder.src = self.config.style.folder_opened;
            DOM_img_folder.dataset.isOpened = 'true';
        }
    }

    hideFolderSubElements(divChildElement) {
        const DOM_parent_folder = divChildElement.closest('ul');
        const DOM_folder_sub_elements = DOM_parent_folder.querySelectorAll('div, ul');

        DOM_folder_sub_elements.forEach(function (folderChild) {

            if (folderChild.dataset.parent_id === 'null')
                return;

            if (folderChild.style.opacity === '0') {
                folderChild.style.opacity = '100';
                folderChild.style.position = 'relative';
                folderChild.style.top = 'auto';
                folderChild.style.left = 'auto';
            } else {
                folderChild.style.opacity = '0';
                folderChild.style.position = 'absolute';
                folderChild.style.top = '-100%';
                folderChild.style.left = '-100%';
            }

        });
    }

    createTreeNodes(dataElement) {
        const self = this;

        dataElement.forEach(function (element) {
            if (element.parent_id === null) {
                self.DOM_tree.appendChild(
                    self.createElement(element)
                );
            } else {
                self.DOM_tree.lastChild.appendChild(
                    self.createElement(element)
                );
            }

            if (typeof element.folder_data === 'object'
                && element.folder_data.length !== 0
            ) {
                self.createTreeNodes(element.folder_data);
            }
        })
    }

    createContextMenu() {
        //
        // Main container
        //
        const NODE_div_container = document.createElement('div');
        NODE_div_container.classList.add('tree-context-menu');
        NODE_div_container.style.backgroundColor = '#151515';
        NODE_div_container.style.borderRadius = '4px';
        NODE_div_container.style.display = 'none'; // flex
        NODE_div_container.style.flexDirection = 'column';
        NODE_div_container.style.alignItems = 'start';
        NODE_div_container.style.position = 'absolute';
        NODE_div_container.id = 'context-menu';

        //
        // Create file div
        //
        const NODE_div_create_file_container = document.createElement('div');
        NODE_div_create_file_container.style.display = 'flex';
        NODE_div_create_file_container.classList.add('context-element');

        const NODE_img_file = document.createElement('img');
        NODE_img_file.src = this.config.style.file;

        const NODE_p_create_file = document.createElement('p');
        NODE_p_create_file.innerText = 'Create file';
        NODE_p_create_file.id = 'create-file';

        NODE_div_create_file_container.append(
            NODE_img_file,
            NODE_p_create_file
        );

        //
        // Create folder div
        //
        const NODE_div_create_folder_container = document.createElement('div');
        NODE_div_create_folder_container.style.display = 'flex';
        NODE_div_create_folder_container.classList.add('context-element');

        const NODE_img_folder = document.createElement('img');
        NODE_img_folder.src = this.config.style.folder_closed;

        const NODE_p_create_folder = document.createElement('p');
        NODE_p_create_folder.innerText = 'Create folder';
        NODE_p_create_folder.id = 'create-folder';

        NODE_div_create_folder_container.append(
            NODE_img_folder,
            NODE_p_create_folder
        );

        //
        // Rename div
        //
        const NODE_div_rename_container = document.createElement('div');
        NODE_div_rename_container.style.display = 'flex';
        NODE_div_rename_container.classList.add('context-element');

        const NODE_img_rename = document.createElement('img');
        NODE_img_rename.src = this.config.style.rename;

        const NODE_p_rename = document.createElement('p');
        NODE_p_rename.innerText = 'Rename';
        NODE_p_rename.id = 'rename';

        NODE_div_rename_container.append(
            NODE_img_rename,
            NODE_p_rename
        );

        //
        // Append to main context container
        //
        NODE_div_container.append(
            NODE_div_create_file_container,
            //NODE_div_create_folder_container,
            NODE_div_rename_container
        );

        this.DOM_tree.appendChild(NODE_div_container);
    }

    createElement(element) {
        const NODE_img_caret = document.createElement('img');
        NODE_img_caret.src = treeConfig.style.caret_closed;
        NODE_img_caret.id = 'caret';
        NODE_img_caret.dataset.isOpened = 'false';

        if (element.type === 'folder') {
            NODE_img_caret.src = (treeConfig.main.hideFolders) ? treeConfig.style.caret_closed : treeConfig.style.caret_opened;
            NODE_img_caret.dataset.isOpened = (treeConfig.main.hideFolders) ? 'false' : 'true';
        }

        const NODE_img_filetype = document.createElement('img');

        NODE_img_filetype.src = (element.type === 'file') ? treeConfig.style.file : treeConfig.style.folder_closed;
        NODE_img_filetype.id = 'folder';
        NODE_img_filetype.dataset.isOpened = 'false';
        NODE_img_filetype.style.width = '18px';
        NODE_img_filetype.style.height = '18px';

        if (element.type === 'folder') {
            NODE_img_filetype.src = (treeConfig.main.hideFolders) ? treeConfig.style.folder_closed : treeConfig.style.folder_opened;
            NODE_img_filetype.dataset.isOpened = (treeConfig.main.hideFolders) ? 'false' : 'true';
        } else {
            NODE_img_filetype.style.marginLeft = '14px';
        }

        const NODE_span_text = document.createElement('span');
        NODE_span_text.innerText = element.name;

        const NODE_div = document.createElement('div');

        NODE_div.dataset.id = element.id;
        NODE_div.dataset.parent_id = element.parent_id;
        NODE_div.dataset.type = element.type;

        if (element.type === 'folder')
            NODE_div.appendChild(NODE_img_caret);

        NODE_div.appendChild(NODE_img_filetype);
        NODE_div.appendChild(NODE_span_text);

        const NODE_li = document.createElement('li');
        NODE_li.appendChild(NODE_div);

        const NODE_ul = document.createElement('ul');
        NODE_ul.classList.add(element.type);
        NODE_ul.dataset.id = element.id;
        NODE_ul.dataset.parent_id = element.parent_id;
        NODE_ul.appendChild(NODE_li);

        return NODE_ul;
    }

    paddingTreeNodes() {
        const DOM_tree_elements = this.DOM_tree.querySelectorAll('ul');

        for (let i=0; i<DOM_tree_elements.length; i++) {
            const element = DOM_tree_elements[i];
            const divs = element.querySelectorAll('[data-type=\'file\']');

            divs.forEach(function (div) {
                if ( ! element.classList.contains('file')) {
                    div.style.paddingLeft = '14px';
                }
            })
        }
    }
}

const treeConfig = {
    main: {
        treeId: 'tree',
        hideFolders: false,
    },
    style: {
        file: 'icons/dark/file.svg',
        folder_opened: 'icons/dark/folder_opened.svg',
        folder_closed: 'icons/dark/folder_closed.svg',
        caret_opened: 'icons/dark/caret_opened.svg',
        caret_closed: 'icons/dark/caret_closed.svg',
        rename: 'icons/dark/edit.svg',
    },
};

const tree = new Tree(treeConfig);
tree.data(treeData);
tree.withMarkdownEditor(simplemde);
tree.init();