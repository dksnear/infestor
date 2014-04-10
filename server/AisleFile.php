 <?php

class AisleFile
{
	public static $FileType=['Directory'=>'d','NormalFile'=>'f','Special'=>'s','Reserve'=>'r'];
	
	public static $ReadMode=['Simple'=>0,'Normal'=>1];

	public $fId;

	public $pId=null;

	public $type;

	public $fullName;

	public $name=null; 

	public $children=null;

	public $parent=null;

	public $fList=null;
	
	public $cList=null;
	
	public $mode;

	private $fso=null;

	private $pfile=null;
	
     
	function __construct()
	{	
		$this->mode=self::$ReadMode['Simple'];
	}
	
	 // 读取文件
	 public function read($fileName,$depth=null)
	 {
		$this->fId=uniqid();
		  
		$this->fullName=$fileName;
		  
		$this->type=self::$FileType['Special'];
		  
		if(is_file($this->fullName))
			$this->type=self::$FileType['NormalFile'];
		 
		if(is_dir($this->fullName))
			$this->type=self::$FileType['Directory'];
		  
		if($this->parent!=null)
		{
			$this->pId=$this->parent->fId;
		}
		  
		$this->fList=[$this->mapProperty()];
				  
		$p=$this->parent;
		  
		while($p!=null&&$this->mode===self::$ReadMode['Simple'])
		{
			$p->fList=array_merge($p->fList,$this->fList);
			$p=$p->parent;
		}
		
		$this->readdir($depth);
		
	 }
	 
	 // 读取目录
	 // @depth 读取深度 如果为空则读取所有层级
	 public function readdir($depth=null)
	 {
		if($depth===0) return;
	 
		if($this->type==self::$FileType['Reserve'])
     	  	return;
		if($this->type==self::$FileType['Special'])
     	  	return;
		if($this->type==self::$FileType['NormalFile'])
          	return;
		if($this->type==self::$FileType['Directory'])
		{
		   $this->children=[];
		   $this->cList=[];
		   $this->fso=opendir($this->fullName);
		   while($this->pfile=readdir($this->fso))
		   {
			   if($this->pfile=='.'||$this->pfile=='..')
					continue;
			   
			   $aisleFile=new AisleFile();
			   $aisleFile->parent=$this;
			   $aisleFile->name=$this->pfile;
			   $aisleFile->read($this->fullName.'/'.$this->pfile,$depth?$depth-1:null);
			   $this->children[]=$aisleFile;
			   $this->cList[]=$aisleFile->mapProperty();
			           
		   }
		   closedir($this->fso);
		}
	 }
    
     
     protected function mapProperty()
     {
     	return array(
			//'fId'=>$this->fId,
			//'pId'=>$this->pId,
			'type'=>$this->type,
			'fullName'=>iconv('GBK','UTF-8//IGNORE',$this->fullName),
			'name'=>iconv('GBK','UTF-8//IGNORE',$this->name)
		);
     }
     
}

function escape($str) {  
    $sublen = strlen ( $str );  
    $retrunString = '';  
    for($i = 0; $i < $sublen; $i ++) {  
        if (ord ( $str [$i] ) >= 127) {  
            $tmpString = bin2hex ( iconv ( 'gb2312', 'ucs-2', substr ( $str, $i, 2 ) ) );  
            $retrunString .= '%u' . $tmpString;  
            $i ++;  
        } else {  
            $retrunString .= '%' . dechex ( ord ( $str [$i] ) );  
        }  
    }  
    return $retrunString;  
} 

function unescape($str) {  
    $str = rawurldecode ( $str );  
    preg_match_all ( '/%u.{4}|&#x.{4};|&#\d+;|.+/U', $str, $r );  
    $ar = $r [0];  
    foreach ( $ar as $k => $v ) {  
        if (substr ( $v, 0, 2 ) == '%u')  
            $ar [$k] = iconv ( 'UCS-2', 'GBK', pack ( 'H4', substr ( $v, - 4 ) ) );  
        elseif (substr ( $v, 0, 3 ) == '&#x')  
            $ar [$k] = iconv ( 'UCS-2', 'GBK', pack ( 'H4', substr ( $v, 3, - 1 ) ) );  
        elseif (substr ( $v, 0, 2 ) == '&#') {  
            $ar [$k] = iconv ( 'UCS-2', 'GBK', pack ( 'n', substr ( $v, 2, - 1 ) ) );  
        }  
    }  
    return join ( '', $ar );  
}


$path=empty($_GET['path'])?'.': unescape($_GET['path']);

header('Content-Type:"text/javascript"');

$file=new AisleFile();
$file->name='resources';
$file->read($path,1);
$data=json_encode($file->cList,JSON_UNESCAPED_UNICODE);



echo $_GET['callback'].'('.$data.')';

