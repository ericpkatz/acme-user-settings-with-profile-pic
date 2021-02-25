import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateAuth } from '../store';

class Settings extends Component{
  constructor(){
    super();
    this.state = {
      profileImageData: ''
    };
    this.onSubmit = this.onSubmit.bind(this);
  }
  async onSubmit(ev){
    ev.preventDefault();
    await this.props.update(this.state.profileImageData);
    this.setState({ profileImageData: '' });
  }
  componentDidMount(){
    const fileReader = new FileReader();
    this.el.addEventListener('change', ()=> {
      fileReader.readAsDataURL(this.el.files[0]);

      fileReader.addEventListener('load', ()=> {
        this.setState({ profileImageData: fileReader.result});
      });
    });
  }
  render(){
    const { onSubmit } = this;
    const { profileImageData } = this.state;
    return (
      <form onSubmit={ onSubmit }>
        {
          !!profileImageData && <img src={ profileImageData } />
        }
        <div>
            <input type='file' ref={ el => this.el = el }/>
        </div>
        <div>
          <button disabled={ !profileImageData }>Update</button>
        </div>
      </form>
    );
  }
}

const mapDispatchToProps = (dispatch)=> {
  return {
    update: (profileImageData)=> {
      dispatch(updateAuth(profileImageData));
    }
  };
};

export default connect(null, mapDispatchToProps)(Settings);
