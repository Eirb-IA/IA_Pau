import numpy as np

def arr_op(A, B, op):
	R=[]
	for i in range(0,len(A)):
		R.append(op(A[i],B[i]))
	return R

def square(x):
	return x*x

def gather_proba(prob):
	size=np.shape(prob)
	if(size[0]==1):
		return prob[0]
	out=[]

	P=prob.copy()
	R=np.zeros((size[1]))

	minv=size[0]/square(size[1])
	maxv=size[0]*square(1-1/size[1])

	for i in range(0,size[0]):
		for k in range(0, size[1]):
			r=square(P[i][k]-1/(size[1]))
			if P[i][k]<1/size[1]:
				r=-r
			P[i][k]=r

	for i in range(0,size[1]):
		s=0
		for k in range(0,size[0]):
			s=s+P[k][i]
		R[i]=(s+minv)/(minv+maxv)

	return R

a=np.array([[0.2,0.5],[0.2,0.5],[0.2,0.5]])


print(gather_proba(a))
