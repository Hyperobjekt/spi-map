import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Collapse,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import clsx from "clsx";
import React from "react";

/**
 * Renders a list item with an optionally collapsable list of childItems
 */
export const NestedListItem = ({
  id,
  name,
  childItems,
  collapsible,
  depth = 0,
  parents = [],
  selected = [],
  collapseDepths,
  className,
  onClick,
  ...props
}) => {
  const [expanded, setExpanded] = React.useState(true);
  const ChildWrapper = collapsible ? Collapse : React.Fragment;
  const ChildWrapperProps = collapsible ? { in: expanded } : {};
  const childParents = [...parents, id];
  const parentClasses = childParents.map((id) => `HypNestedListItem-${id}`);
  const handleToggle = (event) => {
    setExpanded(!expanded);
    event.stopPropagation();
    event.preventDefault();
  };
  return (
    <>
      <ListItemButton
        className={clsx(
          "HypNestedListItem-root",
          `HypNestedListItem-depth${depth}`,
          ...parentClasses,
          className
        )}
        value={id}
        selected={selected.indexOf(id) > -1}
        onClick={(event) => onClick && onClick(event, id)}
        {...props}
      >
        <ListItemText primary={name} />
        {collapsible && (
          <IconButton size="small" onClick={handleToggle}>
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        )}
      </ListItemButton>
      <ChildWrapper {...ChildWrapperProps}>
        {childItems && (
          <NestedList
            items={childItems}
            depth={depth + 1}
            parents={childParents}
            selected={selected}
            collapseDepths={collapseDepths}
            onClick={onClick}
          />
        )}
      </ChildWrapper>
    </>
  );
};

/**
 * Renders a nested list for the provided items and children
 */
export const NestedList = ({
  items,
  depth,
  collapseDepths = [0],
  className,
  parents = [],
  selected = [],
  onClick,
  ...props
}) => {
  const hasCollapse = collapseDepths.indexOf(depth) > -1;
  if (!items || !items.length) return null;
  return (
    <List
      className={clsx(
        "HypNestedList-root",
        `HypNestedList-depth${depth}`,
        className
      )}
      {...props}
    >
      {items.map(({ id, name, children }) => (
        <NestedListItem
          key={id}
          id={id}
          name={name}
          childItems={children}
          depth={depth}
          parents={parents}
          collapsible={hasCollapse}
          selected={selected}
          collapseDepths={collapseDepths}
          onClick={onClick}
        />
      ))}
    </List>
  );
};

export default NestedList;
