import React from 'react';
import http from 'axios';
import {Input} from 'react-bootstrap';

export default class Form extends React.Component {
   constructor() {
      super();

      this.state = {};
   }
   save(event) {
      event.preventDefault();
      const type = this.props.type;
      const promise = this.state.editing
         ? http.put('/' + type + 's/' + this.refs.id.refs.input.value, this.refs.form.serialize({ignore: ['id']}))
         : http.post('/' + type + 's', this.refs.form.serialize({ignore: ['id']}));

      promise.then(response => {
         this.refs.form.reset();
         this.toggle();
         this.props.onCreated(response.data);
      });
   }
   prepareForEditing(data) {
      this.setState({editing: true, showForm: true});
      this.refs.form.populate(data);
   }
   cancelEditing() {
      this.setState({editing: false, showForm: false});
      this.refs.form.reset();
   }
   toggle() {
      this.setState({showForm: !this.state.showForm});
   }
   render() {
      const {type, children} = this.props;
      const {editing, showForm} = this.state;
      return (
         <div className="panel panel-success">
            <div className="panel-heading" onClick={this.toggle.bind(this)}>{editing ? 'Edit' : 'New'} {type}</div>
            <div className={'panel-body' + (showForm ? '' : ' hide')}>
               <form ref="form" onSubmit={this.save.bind(this)}>
                  {children}
                  <Input ref="id" type="hidden" name="id" />
                  <button type="submit" className="btn btn-primary">{editing ? 'Save' : 'Create'}</button>&nbsp;
                  {editing ? <button onClick={this.cancelEditing.bind(this)} className="btn btn-warning">Cancel</button> : null}
               </form>
            </div>
         </div>
      );
   }
}

HTMLFormElement.prototype.populate = function(values) {
   for (var name in values) {
      var element = this.querySelector('[name=' + name + ']');
      if (element) {
         var value = values[name];
         if (value instanceof Object)
            try {
               value = JSON.stringify(value);
            } catch(e) {}
         element.value = value;
      }
   }
};

HTMLFormElement.prototype.serialize = function(options) {
   options = options || {};
   options.ignore = options.ignore || [];
   return [].slice.call(this.elements).reduce((obj, element) => {
      if (element.nodeName !== 'BUTTON' && options.ignore.indexOf(element.name) === -1 && element.value) {
         obj[element.name] = isNaN(element.value) ? element.value : Number(element.value);
      }
      return obj;
   }, {});
};