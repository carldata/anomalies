commit_number=`git rev-parse HEAD`	
commit_number+="_aecom2"

docker build -t anomalies-client:$commit_number . 

docker tag anomalies-client:$commit_number flowworks-carlsolutions.azurecr.io/flowworks/anomalies-client:$commit_number

#docker login flowworks-carlsolutions.azurecr.io -u flowworks -p +Jg/Y++Wo==r=o2Dn/wFcW+YJQqcF7G/

#docker push flowworks-carlsolutions.azurecr.io/flowworks/anomalies-client:$commit_number	