import React from 'react'
import { connect } from 'react-redux';
import { addAlbum, fetchAlbums, deleteAlbum, deleteModalPop } from '../../actions';
import { Modal, Button, Icon, Row } from 'react-materialize'
import firebase from 'firebase';
import Select from 'react-select';
class DashBoard extends React.Component {

    constructor() {
        super();
        this.state = {
            addModalVideoVisible: false,
            editModalVideoVisible: false,
            selectedVideoType: {},
            selectedEditVideoType: {},
            toEditVideoName: "",
            toEditVideoStorageName: "",
            toEditVideoKey: "",
            progress: 0,
            videos: {},
            images: {},
            imageProgress: 0,
            toEditImageKey: "",
            toEditImageName: "",
            addImageModal: false,
            editImageModal: false,
            deleteVideoModalVisible: false,
            deleteImageModalVisible: false
        }
        this.progress = 0;
        this.videoProgressManage = this.videoProgressManage.bind(this);
    }

    componentWillMount() {
        firebase.database().ref("/videos/").on("value", (snapshot) => {
            this.setState({ videos: snapshot.val() })
        })
        firebase.database().ref("/images/").on("value", (snapshot) => {
            this.setState({ images: snapshot.val() })
        })
    }
    componentDidMount() {
        this.props.fetchAlbums();
    }
    videoProgressManage(snapshot) {
        this.setState({ progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100 });
    }
    imageProgressManage(snapshot) {
        this.setState({ imageProgress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100 });
    }
    pushVideo(name, video, type) {
        if (name !== "" && type !== {}) {
            var uploadTask = firebase.storage().ref('/videos/').child(`${name}.jpg`).put(video);

            uploadTask.on('state_changed', snapshot => this.videoProgressManage(snapshot), () => { },
                () => {
                    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                        firebase.database().ref('/videos/').push({
                            name: name,
                            storageName: uploadTask.snapshot.ref.name,
                            link: downloadURL,
                            size: type
                        })
                            .then(() => {
                                this.setState({ addModalVideoVisible: false })
                            })
                    })
                });
        }
        else
            alert("Please enter the required information!");
    }
    pushImage(name, image) {
        if (name !== "") {
            var uploadTask = firebase.storage().ref('/images/').child(`${name}.jpg`).put(image);

            uploadTask.on('state_changed', snapshot => this.imageProgressManage(snapshot), () => { },
                () => {
                    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                        firebase.database().ref('/images/').push({
                            name: name,
                            storageName: uploadTask.snapshot.ref.name,
                            link: downloadURL,
                        })
                            .then(() => {
                                this.setState({ addImageModal: false })
                            })
                    })
                });
        }
        else
            alert("Please enter a name!");
    }
    editVideo(name, type, key) {
        firebase.database().ref(`/videos/${key}/name`)
            .set(name)
            .then(() => {
                firebase.database().ref(`/videos/${key}/size`)
                    .set(type)
                    .then(() => {
                        this.setState({ editModalVideoVisible: false })
                    })
            })
    }
    editImage(name, key) {
        firebase.database().ref(`/images/${key}/name`)
            .set(name)
            .then(() => {
                this.setState({ editImageModal: false })
            })
    }
    deleteVideo(key) {
        firebase.database().ref(`/videos/${key}`)
            .remove()
            .then(() => {
                firebase.storage().ref(`/videos`).child(this.state.toEditVideoStorageName)
                    .delete()
                    .then(() => {
                        this.setState({ deleteVideoModalVisible: false })
                    })
            })
    }
    deleteImage(key) {
        firebase.database().ref(`/images/${key}`)
            .remove()
            .then(() => {
                firebase.storage().ref(`/images`).child(this.state.toEditImageStorageName)
                    .delete()
                    .then(() => {
                        this.setState({ deleteImageModalVisible: false })
                    })
            })
    }
    render() {
        return (
            <React.Fragment>
                <div className="container">
                    <h2>Video Portfolio</h2>
                    <div className="row">
                        <div className="col s12">
                            <a className="btn modal-trigger"
                                onClick={() => {
                                    this.setState({ addModalVideoVisible: true })
                                }}
                            >Add Video</a>
                        </div>
                    </div>
                    <ul className="collection">
                        {this.state.videos !== null ? Object.keys(this.state.videos).map((key, i) => {
                            return <li className="collection-item avatar" key={i}>
                                <i className="material-icons circle red">play_arrow</i>
                                <span className="title">{this.state.videos[key].name}</span>
                                <p>{this.state.videos[key].size.label}</p>
                                <a className="secondary-content modal-trigger" onClick={() => {
                                    this.setState({ editModalVideoVisible: true, toEditVideoName: this.state.videos[key].name, toEditVideoStorageName: this.state.videos[key].storageName, toEditVideoKey: key, selectedEditVideoType: this.state.videos[key].size })
                                }}><i className="material-icons">edit</i></a>
                            </li>
                        }) : null}
                    </ul>
                    <br />
                    <hr />
                    <br />

                    <h2>Photos Portfolio</h2>
                    <div className="row">
                        <div className="col s12">
                            <a className="btn modal-trigger" onClick={() => {
                                this.setState({ addImageModal: true })
                            }}>Add Photo</a>
                        </div>
                    </div>
                    <ul className="collection">
                        {this.state.images !== null ? Object.keys(this.state.images).map((key, i) => {
                            return <li className="collection-item avatar" key={i}>
                                <i className="material-icons circle red">photo</i>
                                <span className="title">{this.state.images[key].name}</span>
                                <a className="secondary-content modal-trigger" onClick={() => {
                                    this.setState({ editImageModal: true, toEditImageName: this.state.images[key].name, toEditImageKey: key, toEditImageStorageName: this.state.images[key].storageName })
                                }}><i className="material-icons">edit</i></a>
                            </li>
                        }) : null}
                    </ul>

                    <Modal
                        open={this.state.addModalVideoVisible}
                        modalOptions={{ dismissible: false }}
                        actions={[
                            <Button className="waves-effect waves-green btn-flat" onClick={() => {
                                this.pushVideo(this.selectedVideoName, this.selectedVideo, this.state.selectedVideoType)
                            }}><Icon left>add</Icon>Add Video</Button>,
                            <Button modal="close" className="red darken-2" onClick={() => {
                                this.setState({ addModalVideoVisible: false })
                            }}><Icon left>close</Icon>Close</Button>
                        ]}
                    >
                        <div className="modal-content">
                            <h4>Add Video</h4>
                            <div className="row">
                                <div className="input-field col s12">
                                    <input id="video_name" type="text" onChange={(e) => {
                                        this.selectedVideoName = e.target.value;
                                    }} />
                                    <label htmlFor="email_inline">Name</label>
                                </div>
                                <div className="input-field col s12">
                                    <Select
                                        value={this.state.selectedVideoType}
                                        onChange={(selectedChange) => {
                                            this.setState({ selectedVideoType: selectedChange })
                                        }}
                                        options={[
                                            { value: 'highlight', label: 'Highlight' },
                                            { value: 'medium', label: 'Medium' },
                                            { value: 'small', label: 'Small' }
                                        ]}
                                    />
                                </div>
                                <div className="file-field input-field col s12">
                                    <div className="btn">
                                        <span>File</span>
                                        <input type="file" onChange={(e) => {
                                            this.selectedVideo = e.target.files[0];
                                        }} />
                                    </div>
                                    <div className="file-path-wrapper">
                                        <input className="file-path validate" type="text" />
                                    </div>
                                </div>
                            </div>
                            <Row>
                                <div style={{ width: "100%", height: "20px" }}>
                                    <div
                                        style={{ width: `${this.state.progress}%`, backgroundColor: "#4db6ac", height: "100%" }}
                                    >
                                    </div>
                                </div>
                            </Row>
                        </div>
                    </Modal>
                    <Modal
                        open={this.state.addImageModal}
                        modalOptions={{ dismissible: false }}
                        actions={[
                            <Button className="waves-effect waves-green btn-flat" onClick={() => {
                                this.pushImage(this.selectedImageName, this.selectedImage)
                            }}><Icon left>add</Icon>Add Image</Button>,
                            <Button modal="close" className="red darken-2" onClick={() => {
                                this.setState({ addImageModal: false })
                            }}><Icon left>close</Icon>Close</Button>
                        ]}
                    >
                        <div className="modal-content">
                            <h4>Add Image</h4>
                            <div className="row">
                                <div className="input-field col s12">
                                    <input id="video_name" type="text" onChange={(e) => {
                                        this.selectedImageName = e.target.value;
                                    }} />
                                    <label htmlFor="email_inline">Name</label>
                                </div>
                                <div className="file-field input-field col s12">
                                    <div className="btn">
                                        <span>File</span>
                                        <input type="file" onChange={(e) => {
                                            this.selectedImage = e.target.files[0];
                                        }} />
                                    </div>
                                    <div className="file-path-wrapper">
                                        <input className="file-path validate" type="text" />
                                    </div>
                                </div>
                            </div>
                            <Row>
                                <div style={{ width: "100%", height: "20px" }}>
                                    <div
                                        style={{ width: `${this.state.imageProgress}%`, backgroundColor: "#4db6ac", height: "100%" }}
                                    >
                                    </div>
                                </div>
                            </Row>
                        </div>
                    </Modal>
                    <Modal
                        open={this.state.editModalVideoVisible}
                        modalOptions={{ dismissible: false }}
                        actions={[
                            <Button className="red" onClick={() => {
                                this.setState({ editModalVideoVisible: false })
                            }}><Icon left>close</Icon>Close</Button>,
                            <Button className="waves-effect waves-green btn-flat" onClick={() => {
                                this.editVideo(this.state.toEditVideoName, this.state.selectedEditVideoType, this.state.toEditVideoKey)
                            }}><Icon left>add</Icon>Edit Video</Button>,
                            <Button modal="close" className="red darken-2" onClick={() => {
                                this.setState({ editModalVideoVisible: false, deleteVideoModalVisible: true })
                            }}><Icon left>delete</Icon>Delete</Button>
                        ]}
                    >
                        <div className="modal-content">
                            <h4>Edit Video Info</h4>
                            <div className="input-field col s12">
                                <Select
                                    value={this.state.selectedEditVideoType}
                                    onChange={(selectedChange) => {
                                        this.setState({ selectedEditVideoType: selectedChange })
                                    }}
                                    options={[
                                        { value: 'highlight', label: 'Highlight' },
                                        { value: 'medium', label: 'Medium' },
                                        { value: 'small', label: 'Small' }
                                    ]}
                                />
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <input id="video_name" type="text" value={this.state.toEditVideoName} placeholder="Name" onChange={(e) => {
                                        this.setState({ toEditVideoName: e.target.value })
                                    }} />
                                </div>
                            </div>

                        </div>
                    </Modal>
                    <Modal
                        open={this.state.editImageModal}
                        modalOptions={{ dismissible: false }}
                        actions={[
                            <Button className="red" onClick={() => {
                                this.setState({ editImageModal: false })
                            }}><Icon left>close</Icon>Close</Button>,
                            <Button className="waves-effect waves-green btn-flat" onClick={() => {
                                this.editImage(this.state.toEditImageName, this.state.toEditImageKey)
                            }}><Icon left>add</Icon>Edit Video</Button>,
                            <Button modal="close" className="red darken-2" onClick={() => {
                                this.setState({ editImageModal: false, deleteImageModalVisible: true })
                            }}><Icon left>delete</Icon>Delete</Button>
                        ]}
                    >
                        <div className="modal-content">
                            <h4>Edit Image Info</h4>
                            <div className="row">
                                <div className="input-field col s12">
                                    <input id="video_name" type="text" value={this.state.toEditImageName} placeholder="Name" onChange={(e) => {
                                        this.setState({ toEditImageName: e.target.value })
                                    }} />
                                </div>
                            </div>

                        </div>
                    </Modal>
                    <Modal
                        open={this.state.deleteVideoModalVisible}
                        modalOptions={{ dismissible: false }}
                        actions={[
                            <Button className="waves-effect waves-green btn-flat" onClick={() => {
                                this.deleteVideo(this.state.toEditVideoKey)
                            }}><Icon left>add</Icon>Yes</Button>,
                            <Button modal="close" className="red darken-2" onClick={() => {
                                this.setState({ deleteVideoModalVisible: false })
                            }}><Icon left>close</Icon>No</Button>
                        ]}
                    >
                        <div className="modal-content">
                            <h1>Are you sure you want to delete this video?</h1>
                        </div>
                    </Modal>
                    <Modal
                        open={this.state.deleteImageModalVisible}
                        modalOptions={{ dismissible: false }}
                        actions={[
                            <Button className="waves-effect waves-green btn-flat" onClick={() => {
                                this.deleteImage(this.state.toEditImageKey)
                            }}><Icon left>add</Icon>Yes</Button>,
                            <Button modal="close" className="red darken-2" onClick={() => {
                                this.setState({ deleteImageModalVisible: false })
                            }}><Icon left>close</Icon>No</Button>
                        ]}
                    >
                        <div className="modal-content">
                            <h1>Are you sure you want to delete this image?</h1>
                        </div>
                    </Modal>
                </div>
            </React.Fragment >
        )
    }
}
export default connect(null, { addAlbum, deleteAlbum, fetchAlbums, deleteModalPop })(DashBoard);