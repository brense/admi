<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Accept');

if (preg_match('/\.(?:png|jpg|jpeg|gif|json)$/', filter_input(INPUT_SERVER, 'REQUEST_URI'))) {
  return false;
} else {
  $queryString = filter_input(INPUT_SERVER, 'QUERY_STRING');
  $uri = filter_input(INPUT_SERVER, 'REQUEST_URI');
  $path = ltrim(rtrim(str_replace('?' . $queryString, '', $uri), '/'), '/');
  $method = filter_input(INPUT_SERVER, 'REQUEST_METHOD');
  $match = findResource($path);
  list($requestedFile, $id) = $match;
  try {
    if(!$requestedFile){
      throw new NotFoundException('Resource not found');
    }
    $handler = new RestHandler($requestedFile, $id);
    parse_str($queryString, $params);
    if($method === 'POST' || $method === 'PUT'){
      $params['body'] = json_decode(file_get_contents('php://input'));
    }
    echo $handler->resolve($method, $params);
  } catch(NotFoundException $e){
    header('HTTP/1.1 404 Not Found');
    echo $e->getMessage();
  } catch(Exception $e){
    header('HTTP/1.1 500 Internal Server Error');
    echo $e->getMessage();
  }
}

function findResource($path, $id = null){
  $requestedFile = '../data/mycompanyhash/' . $path . '.json';
  if(file_exists($requestedFile)){
    $ret = array($requestedFile);
    if(!empty($id)){
      $ret[] = $id;
    }
    return $ret;
  }
  $arr = explode('/', $path);
  if(count($arr) === 1){
    return false;
  }
  $id = array_pop($arr);
  return findResource(implode('/', $arr), $id);
}

class NotFoundException extends Exception {}

class RestHandler {

  private $_id;
  private $_resource;

  public function __construct($resource, $id = null){
    $this->_resource = $resource;
    if(!empty($id)){
      $this->_id = $id;
    }
  }

  public function resolve($method, Array $params = array()){
    switch($method){
      case 'GET':
        if(!empty($this->_id)){
          return json_encode($this->getItem());
        } else {
          // TODO: get filters from query string...
          return json_encode($this->getItems());
        }
      case 'POST':
        return json_encode($this->createItems($params['body']));
        case 'PUT':
        if(!empty($this->_id)){
          return json_encode($this->updateItem($params['body']));
        } else {
          return json_encode($this->updateItems($params['body']));
        }
      case 'DELETE':
        if(!empty($this->_id)){
          return json_encode($this->deleteItem());
        } else {
          return json_encode($this->deleteItems($params['ids']));
        }
    }
  }

  // TODO: allow filters...
  private function getItems(){
    $contents = file_get_contents($this->_resource);
    return json_decode($contents);
  }

  private function getItem(){
    $items = $this->getItems();
    foreach($items as $item){
      if($item->id === $this->_id){
        return $item;
      }
    }
    throw new NotFoundException('Resource not found');
  }

  private function createItems($items){
    $single = false;
    if(!is_array($items)){
      $single = true;
      $items = array($items);
    }
    $original = $this->getItems();
    foreach($items as &$item){
      $item->id = md5(microtime());
      $original[] = $item;
    }
    file_put_contents($this->_resource, json_encode($original));
    if($single){
      return $items[0];
    }
    return $items;
  }

  private function updateItems($items){

  }

  private function updateItem($item){

  }

  private function deleteItems($ids){

  }

  private function deleteItem($id){

  }
}
