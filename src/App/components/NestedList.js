import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Collapse, IconButton, List, ListItemButton, ListItemText } from '@mui/material';
import clsx from 'clsx';
import React from 'react';
import PropTypes from 'prop-types';
import escapeRegExp from 'lodash.escaperegexp';

/**
 * Determines if any id matches exist within the children
 * @param {*} matches
 * @param {*} children
 * @returns
 */
const hasChildMatch = (matches = [], children) => {
  // return false if no children
  if (!children || children.length === 0) return false;
  // return true if any child matches
  return children.some(
    (child) => matches.includes(child.id) || hasChildMatch(matches, child.children),
  );
};

const countChildMatches = (matches = [], children) => {
  // return 0 if no children to check
  if (!children || children.length === 0) return 0;
  // sum up the number of child matches
  return children.reduce(
    (count, child) =>
      count + (matches.includes(child.id) ? 1 : countChildMatches(matches, child.children)),
    0,
  );
};

const countAllChildren = (children) => {
  if (!children || children.length === 0) return 1;
  return children.reduce((count, child) => count + countAllChildren(child.children), 0);
};

const Highlighted = ({ text = '', highlight = '' }) => {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }
  const regex = new RegExp(`(${escapeRegExp(highlight)})`, 'gi');
  const parts = text.split(regex);
  return (
    <span>
      {parts
        .filter((part) => part)
        .map((part, i) =>
          regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>,
        )}
    </span>
  );
};

/*
 * TODO: NestedList and NestedListItem could be combined into a
 * single recursive component.  Should use item props instead of
 * passing an array of selected, filtered, expanded, etc.
 */

// const LIST_ITEMS = {
//   id: "root",
//   children: [
//     {
//       id: "a",
//       expanded: true,
//       filtered: false,
//       active: false,
//       children: [],
//     }
//   ],
// }

// const TmpListItem = ({depth, active, expanded, filtered, highlight, children })

/**
 * Renders a list item with an optionally collapsable list of childItems
 */
export const NestedListItem = ({
  id,
  component = ListItemButton,
  name,
  childItems,
  itemProps,
  collapsible,
  depth = 0,
  parents = [],
  selected = [],
  expanded = [],
  filter = [],
  highlight = '',
  collapseDepths,
  className,
  onSelect,
  onToggleExpanded,
  ...props
}) => {
  // base component
  const Component = component;
  const isVisible =
    depth === 0 || filter.length === 0 || filter.includes(id) || hasChildMatch(filter, childItems);

  const childMatches = countChildMatches(filter, childItems);
  const totalChildren = countAllChildren(childItems);
  const matchesString =
    highlight && childItems?.length ? ` (${childMatches}/${totalChildren})` : '';
  const itemLabel = <Highlighted text={name + matchesString} highlight={highlight} />;
  const isSelected = selected.indexOf(id) > -1;
  const isExpanded = expanded.indexOf(id) > -1;
  const ChildWrapper = collapsible ? Collapse : React.Fragment;
  const ChildWrapperProps = collapsible ? { in: isExpanded } : {};
  const childParents = [...parents, id];
  const parentClasses = childParents.map((id) => `HypNestedListItem-${id}`);
  const handleSelect = (event) => onSelect && onSelect(event, id);
  const handleToggleExpanded = (event) => onToggleExpanded && onToggleExpanded(event, id);
  if (!isVisible) return null;
  return (
    <>
      <Component
        className={clsx(
          'HypNestedListItem-root',
          `HypNestedListItem-depth${depth}`,
          ...parentClasses,
          isExpanded && 'HypNestedListItem-expanded',
          className,
        )}
        value={id}
        itemProps={{ name, ...itemProps }}
        selected={isSelected}
        onClick={handleSelect}
        {...props}
      >
        <ListItemText primary={itemLabel} />
        {collapsible && (
          <IconButton
            className="HypNestedListItem-toggle"
            size="small"
            onClick={handleToggleExpanded}
          >
            {isExpanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        )}
      </Component>
      <ChildWrapper {...ChildWrapperProps}>
        {childItems && (
          <NestedList
            items={childItems}
            childComponent={component}
            depth={depth + 1}
            parents={childParents}
            selected={selected}
            expanded={expanded}
            filter={filter}
            highlight={highlight}
            collapseDepths={collapseDepths}
            onSelect={onSelect}
            onToggleExpanded={onToggleExpanded}
          />
        )}
      </ChildWrapper>
    </>
  );
};

/**
 * Renders a nested list for the provided items and children
 */
const NestedList = ({
  items,
  childComponent,
  depth = 0,
  collapseDepths = [0],
  className,
  parents = [],
  selected = [],
  expanded = [],
  filter = [],
  highlight,
  onSelect,
  onToggleExpanded,
  ...props
}) => {
  if (!items || !items.length) return null;
  return (
    <List
      className={clsx('HypNestedList-root', `HypNestedList-depth${depth}`, className)}
      {...props}
    >
      {items.map(({ id, name, children, ...itemProps }) => {
        const hasCollapse =
          children && children.length > 0 && !highlight && collapseDepths.indexOf(depth) > -1;
        return (
          <NestedListItem
            key={id}
            id={id}
            name={name}
            component={childComponent}
            childItems={children}
            depth={depth}
            parents={parents}
            collapsible={hasCollapse}
            selected={selected}
            expanded={expanded}
            highlight={highlight}
            filter={filter}
            collapseDepths={collapseDepths}
            itemProps={itemProps}
            onSelect={onSelect}
            onToggleExpanded={onToggleExpanded}
          />
        );
      })}
    </List>
  );
};

NestedList.propTypes = {
  /** An array of list items, should have `id`, `name`, `children` props. */
  items: PropTypes.arrayOf(PropTypes.object),
  /** The base component to use for each list item. */
  childComponent: PropTypes.any,
  /** Indicated the depth of the nested list */
  depth: PropTypes.number,
  /** Determines which depths are collapsed */
  collapseDepths: PropTypes.arrayOf(PropTypes.number),
  className: PropTypes.string,
  /** An array of parent IDs for the list (if any) */
  parents: PropTypes.arrayOf(PropTypes.string),
  /** An array of IDs that should have "selected status"  */
  selected: PropTypes.arrayOf(PropTypes.string),
  /** An array of IDs that should be expanded */
  expanded: PropTypes.arrayOf(PropTypes.string),
  /** An array of IDs that should be shown in the list */
  filter: PropTypes.arrayOf(PropTypes.string),
  /** A string to highlight in on list item names */
  highlight: PropTypes.string,
  /** A function to call when a list item is selected */
  onSelect: PropTypes.func,
  /** A function to call when a list item is expanded or collapsed */
  onToggleExpanded: PropTypes.func,
};

export default NestedList;
