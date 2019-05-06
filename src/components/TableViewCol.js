import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export const defaultViewColStyles = theme => ({
  root: {
    padding: '16px 24px 16px 24px',
    fontFamily: 'Roboto',
  },
  title: {
    marginLeft: '-7px',
    fontSize: '14px',
    color: theme.palette.text.secondary,
    textAlign: 'left',
    fontWeight: 500,
  },
  formGroup: {
    marginTop: '8px',
  },
  formControl: {},
  checkbox: {
    padding: '0px',
    width: '32px',
    height: '32px',
  },
  checkboxRoot: {
    '&$checked': {
      color: theme.palette.primary.main,
    },
  },
  checked: {},
  label: {
    fontSize: '15px',
    marginLeft: '8px',
    color: theme.palette.text.primary,
  },
});

const grid = 8;

const getItemStyle = (draggableStyle) => ({
  display: 'flex',
  justifyContent:'space-between',
  ...draggableStyle,
});

class TableViewCol extends React.Component {
  static propTypes = {
    /** Columns used to describe table */
    columns: PropTypes.array.isRequired,
    /** Options used to describe table */
    options: PropTypes.object.isRequired,
    /** Callback to trigger View column update */
    onColumnUpdate: PropTypes.func,
    /** Extend the style applied to components */
    classes: PropTypes.object,
  };

  state = {
      columns : this.props.columns,
      data : this.props.data,
    };

  handleColChange = index => {
    this.props.onColumnUpdate(index);
  };


  rearrangeColumns = (result) => {
    const columns = this.state.columns;
    const col = columns[result.source.index];
    columns.splice(result.source.index,1);
    columns.splice(result.destination.index,0,col);
    this.props.onColumnReorder(columns);
  };

  rearrangeData = (result) => {
    const data = this.state.data;
    data.map(d => {
      const dt = d.data[result.source.index];
      d.data.splice(result.source.index,1);
      d.data.splice(result.destination.index,0,dt);
    });
    this.props.onDataReorder(data);
  }

  onDragEnd = (result) => {
    this.rearrangeColumns(result);
    this.rearrangeData(result);
  }

  render() {
    const { classes, options } = this.props;
    const textLabels = options.textLabels.viewColumns;
    return (
        <FormControl component={'fieldset'} className={classes.root} aria-label={textLabels.titleAria}>
          <DragDropContext onDragEnd={this.onDragEnd}>
            <div>
              <Typography variant="caption" className={classes.title}>
                  {textLabels.title}
                </Typography>
                <Droppable droppableId="droppable">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                    >
                      <FormGroup className={classes.formGroup}>
                        {this.state.columns.map((column, index) => {
                          return (
                            column.display !== 'excluded' &&
                            column.viewColumns !== false && (
                              <Draggable key={column.name} draggableId={column.name} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={getItemStyle(
                                    provided.draggableProps.style
                                  )}
                                >
                                  <FormControlLabel
                                        classes={{
                                          root: classes.formControl,
                                          label: classes.label,
                                        }}
                                        control={
                                          <Checkbox
                                            className={classes.checkbox}
                                            classes={{
                                              root: classes.checkboxRoot,
                                              checked: classes.checked,
                                            }}
                                            onChange={this.handleColChange.bind(null, index)}
                                            checked={column.display === 'true'}
                                            value={column.name}
                                          />
                                        }
                                        label={column.name}
                                      />
                                  <span style={{cursor: 'grab', position: 'relative', top: 4}}><DragHandleIcon /></span>
                                </div>
                                )}
                            </Draggable>
                              )
                            );
                        }
                      )}
                    </FormGroup>
                  </div>
                )}
              </Droppable>
            </div>
        </DragDropContext>
      </FormControl>
    );
  }
}

export default withStyles(defaultViewColStyles, { name: 'MUIDataTableViewCol' })(TableViewCol);
